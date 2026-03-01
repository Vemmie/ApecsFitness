import EquipmentSelector from "@/components/exercises/CreateExercises/EquipmentSelector";
import MuscleSelector from "@/components/exercises/CreateExercises/MuscleSelector";
import ThemedAppHeader from "@/components/ThemedAppHeader";
import EquipmentEnum from "@/constants/EquipmentEnum";
import MuscleEnum from "@/constants/MuscleEnum";
import RecordType from "@/constants/RecordType";
import { insertExercise } from "@/database/models/exercise";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  RadioButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

const CreateExercise = () => {
  const theme = useTheme();
  const router = useRouter();
  const db = useSQLiteContext();

  const [exerciseName, setExerciseName] = useState<string>("");
  const [selectedEquipment, setEquipment] = useState<EquipmentEnum>();
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleEnum>();
  const [selectedMuscle_Secondary, setSelectedMuscle_Secondary] =
    useState<MuscleEnum>();
  const [recordType, setRecordType] = useState<RecordType>(
    RecordType.WEIGHT_AND_REPS,
  );

  const goBack = () => router.navigate("..");

  // --- 1. AUTO-CLEAR LOGIC ---
  // If user changes Primary to match what is already in Secondary, clear Secondary.
  useEffect(() => {
    if (selectedMuscle && selectedMuscle === selectedMuscle_Secondary) {
      setSelectedMuscle_Secondary(undefined);
    }
  }, [selectedMuscle]);

  const handleCreate = async () => {
    // Basic Validation
    if (!exerciseName.trim()) {
      Alert.alert("Error", "Please enter an exercise name.");
      return;
    }
    if (!selectedMuscle) {
      Alert.alert("Error", "Please select a primary muscle.");
      return;
    }

    try {
      await insertExercise(db, {
        name: exerciseName,
        primary_muscle: selectedMuscle,
        secondary_muscle: selectedMuscle_Secondary || MuscleEnum.NONE,
        equipment: selectedEquipment || EquipmentEnum.OTHER,
        record_type: recordType,
      });
      goBack();
    } catch (error) {
      console.error("Failed to insert exercise:", error);
      Alert.alert("Error", "Could not save exercise.");
    }
  };

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <ThemedAppHeader
        title="Create Exercise"
        showBackButton={true}
        onBackPress={goBack}
      />

      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16, gap: 24 }}>
          <TextInput
            label="Exercise Name"
            value={exerciseName}
            onChangeText={setExerciseName}
            mode="outlined"
          />

          <View>
            <Text style={[styles.label, { color: theme.colors.primary }]}>
              Primary Muscle
            </Text>
            <MuscleSelector
              selectedMuscle={selectedMuscle}
              setSelectedMuscle={setSelectedMuscle}
            />
          </View>

          <View>
            <Text style={[styles.label, { color: theme.colors.primary }]}>
              Secondary Muscle
            </Text>
            <MuscleSelector
              selectedMuscle={selectedMuscle_Secondary}
              // --- 3. SELECTION VALIDATION ---
              setSelectedMuscle={(muscle) => {
                if (muscle && muscle === selectedMuscle) {
                  Alert.alert(
                    "Selection Error",
                    "Secondary muscle cannot be the same as primary.",
                  );
                  return;
                }
                setSelectedMuscle_Secondary(muscle);
              }}
            />
          </View>

          <EquipmentSelector
            selectedEquipment={selectedEquipment}
            setEquipment={setEquipment}
          />

          <RadioButton.Group
            onValueChange={(newValue) => setRecordType(newValue as RecordType)}
            value={recordType}
          >
            <Text style={[styles.label, { color: theme.colors.primary }]}>
              Record Type
            </Text>
            <RadioButton.Item
              label={RecordType.WEIGHT_AND_REPS}
              value={RecordType.WEIGHT_AND_REPS}
              style={styles.radioButtonItem}
            />
            <RadioButton.Item
              label={RecordType.TIME}
              value={RecordType.TIME}
              style={styles.radioButtonItem}
            />
          </RadioButton.Group>
        </View>

        <View style={{ padding: 16, marginBottom: 20 }}>
          <Button mode="contained" onPress={handleCreate}>
            Create
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  radioButtonItem: {
    paddingHorizontal: 0,
  },
});

export default CreateExercise;
