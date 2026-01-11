import EquipmentSelector from "@/components/exercises/CreateExercises/EquipmentSelector";
import MuscleSelector from "@/components/exercises/CreateExercises/MuscleSelector";
import EquipmentEnum from "@/constants/EquipmentEnum";
import MuscleEnum from "@/constants/MuscleEnum";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface FilterExerciseSelectorProps {
  selectedMuscle: MuscleEnum | undefined;
  setSelectedMuscle: (muscle: MuscleEnum | undefined) => void;
  equipment: EquipmentEnum | undefined;
  setEquipment: (equipment: EquipmentEnum | undefined) => void;
}

const FilterExerciseSelector: React.FC<FilterExerciseSelectorProps> = ({
  selectedMuscle,
  setSelectedMuscle,
  equipment,
  setEquipment,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {/* Muscle Selection */}
      <Text style={[styles.label, { color: theme.colors.onSurface }]}>
        Select Muscle
      </Text>
      <MuscleSelector
        selectedMuscle={selectedMuscle}
        setSelectedMuscle={setSelectedMuscle}
      />

      <View style={{ height: 24 }} />

      {/* Equipment Selection */}
      <Text style={[styles.label, { color: theme.colors.onSurface }]}>
        Select Equipment
      </Text>
      <EquipmentSelector
        selectedEquipment={equipment}
        setEquipment={setEquipment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold", // Made slightly bolder for better hierarchy
    marginBottom: 12,
  },
});

export default FilterExerciseSelector;
