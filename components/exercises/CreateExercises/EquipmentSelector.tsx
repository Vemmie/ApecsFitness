import EquipmentEnum from "@/constants/EquipmentEnum";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import EquipmentChip from "./EquipmentChip";

type Props = {
  selectedEquipment?: EquipmentEnum | undefined;
  setEquipment: (equipment: EquipmentEnum | undefined) => void;
};

const EquipmentSelector = ({ selectedEquipment, setEquipment }: Props) => {
  const theme = useTheme();

  const handlePress = (equipment: EquipmentEnum) => {
    if (selectedEquipment === equipment) {
      setEquipment(undefined);
    } else {
      setEquipment(equipment);
    }
  };

  return (
    <View style={[styles.contents]}>
      <Text style={{ fontSize: 16, color: theme.colors.primary }}>
        Equipment
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexGrow: 1,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {Object.values(EquipmentEnum)
          .filter((item) => item !== EquipmentEnum.NONE)
          .map((equipment) => (
            <EquipmentChip
              key={equipment}
              style={styles.chip}
              equipment={equipment}
              isSelected={selectedEquipment == equipment}
              onPress={handlePress}
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

export default EquipmentSelector;
