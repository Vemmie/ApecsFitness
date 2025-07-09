import React from "react";
import { useTheme } from "react-native-paper";

import { StyleSheet, Text, View } from "react-native";
import MuscleChip from "./MuscleChip";

type Props = {
  selectedMuscles: Set<string>;
  setSelectedMuscles: React.Dispatch<React.SetStateAction<Set<string>>>;
};

const Muscles = [
  "Chest",
  "Upper Back",
  "Lats",
  "Lower Back",
  "Shoulders",
  "Forearms",
  "Biceps",
  "Triceps",
  "Quads",
  "Hamstrings",
  "Calves",
  "Glutes",
  "Abs",
  "Hip Flexors",
];

const MuscleSelector = ({ selectedMuscles, setSelectedMuscles }: Props) => {
  const theme = useTheme();

  const addSelectedMuscle = (muscle: string) => {
    setSelectedMuscles((prev) => {
      const newMuscles = new Set(prev);
      newMuscles.add(muscle);
      return newMuscles;
    });
  };

  const removeSelectedMuscle = (muscle: string) => {
    setSelectedMuscles((prev) => {
      const newMuscles = new Set(prev);
      newMuscles.delete(muscle);
      return newMuscles;
    });
  };

  return (
    <View style={[styles.contents]}>
      <Text style={{ fontSize: 16, color: theme.colors.primary }}>Muscles</Text>
      <View
        style={{
          flexDirection: "row",
          flexGrow: 1,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {Muscles.map((muscle) => (
          <MuscleChip
            key={muscle}
            style={styles.chip}
            muscle={muscle}
            selectedMuscles={selectedMuscles}
            addSelectedMuscle={addSelectedMuscle}
            removeSelectedMuscle={removeSelectedMuscle}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contents: { gap: 8 },
  chip: {
    width: "45%",
    flexGrow: 1,
  },
});
export default MuscleSelector;
