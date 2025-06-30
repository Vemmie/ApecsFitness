import CreateExercisesHeader from "@/components/exercises/CreateExercises/CreateExercisesHeader";
import EquipmentSelector from "@/components/exercises/CreateExercises/EquipmentSelector";
import MuscleSelector from "@/components/exercises/CreateExercises/MuscleSelector";
import EquipmentEnum from "@/constants/EquipmentEnum";
import RecordType from "@/constants/RecordType";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { RadioButton, Text, TextInput, useTheme } from "react-native-paper";

const createExercise = () => {
  const theme = useTheme();
  const [exerciseName, setExerciseName] = React.useState<string>("");
  const [equipment, setEquipment] = React.useState<EquipmentEnum>();
  const [selectedMuscles, setSelectedMuscles] = React.useState<Set<string>>(
    new Set(),
  );
  const [recordType, setRecordType] = React.useState<RecordType>(
    RecordType.WEIGHT_AND_REPS,
  );

  return (
    <View style={{ backgroundColor: theme.colors.surface, flexShrink: 1 }}>
      <CreateExercisesHeader />

      <ScrollView>
        <View style={{ padding: 16, gap: 24 }}>
          <TextInput
            label="Exercise Name"
            value={exerciseName}
            onChangeText={(text) => setExerciseName(text)}
            mode="outlined"
            style={{ marginBottom: 16 }}
          />
          <MuscleSelector
            selectedMuscles={selectedMuscles}
            setSelectedMuscles={setSelectedMuscles}
          />

          <EquipmentSelector
            selectedEquipment={equipment}
            setEquipment={setEquipment}
          />

          <RadioButton.Group
            onValueChange={(newValue: string) =>
              setRecordType(newValue as RecordType)
            }
            value={recordType}
          >
            <Text style={{ fontSize: 16, color: theme.colors.primary }}>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    width: "50%",
    flexGrow: 1,
  },
  radioButtonItem: {
    paddingHorizontal: 8,
  },
});

export default createExercise;
