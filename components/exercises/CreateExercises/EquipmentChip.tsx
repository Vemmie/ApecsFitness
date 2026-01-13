import EquipmentEnum from "@/constants/EquipmentEnum";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Chip } from "react-native-paper";

type Props = {
  style: StyleProp<ViewStyle>;
  equipment: EquipmentEnum;
  isSelected: boolean;
  onPress: (equipment: EquipmentEnum) => void;
};

const EquipmentChip = ({ style, equipment, isSelected, onPress }: Props) => {
  return (
    <Chip
      style={style}
      mode="outlined"
      selected={isSelected}
      showSelectedOverlay={true}
      showSelectedCheck={false}
      onPress={() => {
        onPress(equipment);
      }}
    >
      {equipment}
    </Chip>
  );
};

export default EquipmentChip;
