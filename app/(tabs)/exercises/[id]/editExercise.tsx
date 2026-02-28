import EquipmentSelector from "@/components/exercises/CreateExercises/EquipmentSelector";
import MuscleSelector from "@/components/exercises/CreateExercises/MuscleSelector";
import ThemedAppHeader from "@/components/ThemedAppHeader";
import EquipmentEnum from "@/constants/EquipmentEnum";
import MuscleEnum from "@/constants/MuscleEnum";
import RecordType from "@/constants/RecordType";
import { fetchtExerciseById, updateExercise } from "@/database/models/exercise"; // Assuming getExerciseById exists
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  RadioButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

const EditExercise = () => {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const db = useSQLiteContext();

  const [loading, setLoading] = useState(true);
  const [exerciseName, setExerciseName] = useState<string>("");
  const [selectedEquipment, setEquipment] = useState<EquipmentEnum>();
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleEnum>();
  const [selectedMuscle_Secondary, setSelectedMuscle_Secondary] =
    useState<MuscleEnum>();
  const [recordType, setRecordType] = useState<RecordType>(
    RecordType.WEIGHT_AND_REPS,
  );

  const goBack = () => router.back();

  // --- 1. FETCH EXISTING DATA ---
  useEffect(() => {
    const loadExercise = async () => {
      try {
        // Replace this with your actual fetch function from your model
        const data = await fetchtExerciseById(db, Number(id));
        if (data) {
          setExerciseName(data.name);
          setSelectedMuscle(data.primary_muscle as MuscleEnum);
          setSelectedMuscle_Secondary(
            data.secondary_muscle === "None"
              ? undefined
              : (data.secondary_muscle as MuscleEnum),
          );
          setEquipment(data.equipment as EquipmentEnum);
          setRecordType(data.record_type as RecordType);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load exercise details.");
        goBack();
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [id]);

  // --- 2. AUTO-CLEAR LOGIC ---
  useEffect(() => {
    if (selectedMuscle && selectedMuscle === selectedMuscle_Secondary) {
      setSelectedMuscle_Secondary(undefined);
    }
  }, [selectedMuscle]);

  const handleUpdate = async () => {
    if (!exerciseName.trim()) {
      Alert.alert("Error", "Please enter an exercise name.");
      return;
    }
    if (!selectedMuscle) {
      Alert.alert("Error", "Please select a primary muscle.");
      return;
    }

    try {
      await updateExercise(db, {
        id: Number(id),
        name: exerciseName,
        primary_muscle: selectedMuscle,
        secondary_muscle: selectedMuscle_Secondary || MuscleEnum.NONE,
        equipment: selectedEquipment || EquipmentEnum.OTHER,
        record_type: recordType,
      });
      Alert.alert("Success", "Exercise updated successfully.");
      goBack();
    } catch (error) {
      console.error("Failed to update exercise:", error);
      Alert.alert("Error", "Could not update exercise.");
    }
  };

  if (loading) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.surface }]}
      >
        <ActivityIndicator animating={true} color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <ThemedAppHeader
        title="Edit Exercise"
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
              label={RecordType.REPS}
              value={RecordType.REPS}
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
          <Button mode="contained" onPress={handleUpdate}>
            Save Changes
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditExercise;
