import EquipmentSelector from "@/components/exercises/CreateExercises/EquipmentSelector";
import MuscleSelector from "@/components/exercises/CreateExercises/MuscleSelector";
import EquipmentEnum from "@/constants/EquipmentEnum";
import MuscleEnum from "@/constants/MuscleEnum";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

// Define the props for this component
interface FilterExerciseSelectorProps {
  selectedMuscle: MuscleEnum | undefined;
  setSelectedMuscle: React.Dispatch<
    React.SetStateAction<MuscleEnum | undefined>
  >;
  equipment: EquipmentEnum | undefined;
  setEquipment: React.Dispatch<React.SetStateAction<EquipmentEnum | undefined>>;
}

const FilterExerciseSelector: React.FC<FilterExerciseSelectorProps> = ({
  selectedMuscle,
  setSelectedMuscle,
  equipment,
  setEquipment,
}) => {
  const theme = useTheme();

  // Internal state to hold a Set for MuscleSelector
  const [muscleSet, setMuscleSet] = useState<Set<MuscleEnum>>(
    selectedMuscle ? new Set([selectedMuscle]) : new Set(),
  );

  // Sync internal Set -> parent state whenever it changes
  useEffect(() => {
    const first = muscleSet.values().next().value;
    setSelectedMuscle(first);
  }, [muscleSet]);

  // Sync parent state -> internal Set whenever parent changes (e.g., reset filters)
  useEffect(() => {
    setMuscleSet(selectedMuscle ? new Set([selectedMuscle]) : new Set());
  }, [selectedMuscle]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline,
        },
      ]}
    >
      <ScrollView nestedScrollEnabled style={{ maxHeight: 300 }}>
        <Text style={[styles.label, { color: theme.colors.onSurface }]}>
          Select Muscle
        </Text>
        <MuscleSelector
          selectedMuscles={muscleSet}
          setSelectedMuscles={setMuscleSet}
        />

        <Text style={[styles.label, { color: theme.colors.onSurface }]}>
          Select Equipment
        </Text>
        <EquipmentSelector
          selectedEquipment={equipment}
          setEquipment={setEquipment}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 24,
    flexShrink: 1,
    borderWidth: 1,
    borderRadius: 8,
  },
  chip: {
    width: "50%",
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
});

export default FilterExerciseSelector;
