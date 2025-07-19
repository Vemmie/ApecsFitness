import MuscleEnum from "@/constants/MuscleEnum";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Chip } from "react-native-paper";

type Props = {
  style: StyleProp<ViewStyle>;
  muscle: MuscleEnum;
  selectedMuscles: Set<MuscleEnum>;
  addSelectedMuscle: (muscles: MuscleEnum) => void;
  removeSelectedMuscle: (muscles: MuscleEnum) => void;
};

const MuscleChip = ({
  style,
  muscle,
  selectedMuscles,
  addSelectedMuscle,
  removeSelectedMuscle,
}: Props) => {
  return (
    <Chip
      style={style}
      mode="outlined"
      selected={selectedMuscles.has(muscle)}
      showSelectedOverlay={true}
      showSelectedCheck={false}
      onPress={() => {
        selectedMuscles.has(muscle)
          ? removeSelectedMuscle(muscle)
          : addSelectedMuscle(muscle);
      }}
    >
      {muscle}
    </Chip>
  );
};

export default MuscleChip;
