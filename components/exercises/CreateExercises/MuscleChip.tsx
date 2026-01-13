import MuscleEnum from "@/constants/MuscleEnum";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Chip } from "react-native-paper";

type Props = {
  style: StyleProp<ViewStyle>;
  muscle: MuscleEnum;
  isSelected: boolean;
  onPress: (muscles: MuscleEnum) => void;
};

const MuscleChip = ({ style, muscle, isSelected, onPress }: Props) => {
  return (
    <Chip
      style={style}
      mode="outlined"
      selected={isSelected}
      showSelectedOverlay={true}
      showSelectedCheck={false}
      onPress={() => onPress(muscle)}
    >
      {muscle}
    </Chip>
  );
};

export default MuscleChip;
