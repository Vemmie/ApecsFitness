import CreateExercisesHeader from "@/components/exercises/CreateExercises/CreateExercisesHeader";
import EquipmentSelector from "@/components/exercises/CreateExercises/EquipmentSelector";
import MuscleSelector from "@/components/exercises/CreateExercises/MuscleSelector";
import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";

const createExercise = () => {
  const theme = useTheme();
  const [exerciseName, setExerciseName] = React.useState<string>("");
  const [equipment, setEquipment] = React.useState<string>("");
  const [selectedMuscles, setSelectedMuscles] = React.useState<Set<string>>(
    new Set(),
  );

  return (
    <View style={{ backgroundColor: theme.colors.surface, flexGrow: 1 }}>
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
            equipment={equipment}
            setEquipment={setEquipment}
          />
          <Text style={{ fontSize: 16, color: theme.colors.primary }}>
            Record Type
          </Text>
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
});

export default createExercise;
