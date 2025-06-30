import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import EquipmentChip from "./EquipmentChip";

type Props = {
  equipment: string;
  setEquipment: (equipment: string) => void;
};

const EquipmentSelector = ({ equipment, setEquipment }: Props) => {
  const theme = useTheme();
  return (
    <View style={[styles.contents]}>
      <Text style={{ fontSize: 16, color: theme.colors.primary }}>
        Equipment
      </Text>
      <View style={{ flexDirection: "column", flexGrow: 1, gap: 8 }}>
        <View style={{ flexDirection: "row", flexGrow: 1, gap: 8 }}>
          <EquipmentChip
            style={styles.chip}
            equipment="Barbell"
            selectedEquipment={equipment}
            setEquipment={setEquipment}
          />
          <EquipmentChip
            style={styles.chip}
            equipment="Dumbbell"
            selectedEquipment={equipment}
            setEquipment={setEquipment}
          />
        </View>
        <View style={{ flexDirection: "row", flexGrow: 1, gap: 8 }}>
          <EquipmentChip
            style={styles.chip}
            equipment="Machine"
            selectedEquipment={equipment}
            setEquipment={setEquipment}
          />
          <EquipmentChip
            style={styles.chip}
            equipment="Kettlebell"
            selectedEquipment={equipment}
            setEquipment={setEquipment}
          />
        </View>
        <View style={{ flexDirection: "row", flexGrow: 1, gap: 8 }}>
          <EquipmentChip
            style={styles.chip}
            equipment="Bodyweight"
            selectedEquipment={equipment}
            setEquipment={setEquipment}
          />
          <EquipmentChip
            style={styles.chip}
            equipment="Cable"
            selectedEquipment={equipment}
            setEquipment={setEquipment}
          />
        </View>
        <View style={{ flexDirection: "row", flexGrow: 1, gap: 8 }}>
          <EquipmentChip
            style={styles.chip}
            equipment="Cardio"
            selectedEquipment={equipment}
            setEquipment={setEquipment}
          />
          <EquipmentChip
            style={styles.chip}
            equipment="Other"
            selectedEquipment={equipment}
            setEquipment={setEquipment}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contents: { gap: 8 },
  chip: {
    width: "50%",
    flexGrow: 1,
  },
});

export default EquipmentSelector;
