import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Chip } from "react-native-paper";

type Props = {
  style: StyleProp<ViewStyle>;
  equipment: string;
  selectedEquipment: string;
  setEquipment: (equipment: string) => void;
};

const EquipmentChip = ({
  style,
  equipment,
  selectedEquipment,
  setEquipment,
}: Props) => {
  return (
    <Chip
      style={style}
      mode="outlined"
      selected={selectedEquipment === equipment}
      showSelectedOverlay={true}
      showSelectedCheck={false}
      onPress={() => {
        selectedEquipment == equipment
          ? setEquipment("")
          : setEquipment(equipment);
      }}
    >
      {equipment}
    </Chip>
  );
};

export default EquipmentChip;
