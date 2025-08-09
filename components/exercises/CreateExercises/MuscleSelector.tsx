import MuscleEnum from "@/constants/MuscleEnum";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import MuscleChip from "./MuscleChip";

type Props = {
  selectedMuscles: Set<MuscleEnum>;
  setSelectedMuscles: React.Dispatch<React.SetStateAction<Set<MuscleEnum>>>;
};

const MuscleSelector = ({ selectedMuscles, setSelectedMuscles }: Props) => {
  const theme = useTheme();

  const addSelectedMuscle = (muscle: MuscleEnum) => {
    setSelectedMuscles((prev) => {
      const newMuscles = new Set(prev);
      newMuscles.add(muscle);
      return newMuscles;
    });
  };

  const removeSelectedMuscle = (muscle: MuscleEnum) => {
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
        {Object.values(MuscleEnum).map((muscle) => (
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
