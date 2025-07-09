import EquipmentEnum from "@/constants/EquipmentEnum";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Chip } from "react-native-paper";

type Props = {
  style: StyleProp<ViewStyle>;
  equipment: EquipmentEnum;
  selectedEquipment?: EquipmentEnum;
  setEquipment: (equipment: EquipmentEnum) => void;
};

const EquipmentChip = ({
  style,
  equipment,
  selectedEquipment,
  setEquipment,
}: Props) => {
  console.log(
    "EquipmentChip rendered with equipment:",
    equipment,
    "selectedEquipment:",
    selectedEquipment,
  );
  return (
    <Chip
      style={style}
      mode="outlined"
      selected={selectedEquipment == equipment}
      showSelectedOverlay={true}
      showSelectedCheck={false}
      onPress={() => {
        selectedEquipment == equipment
          ? setEquipment(EquipmentEnum.NONE) // Deselect if already selected
          : setEquipment(equipment);
        console.log(`Selected equipment: ${equipment}`);
      }}
    >
      {equipment}
    </Chip>
  );
};

export default EquipmentChip;
