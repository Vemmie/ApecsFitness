import CreateExercisesHeader from "@/components/exercises/CreateExercises/CreateExercisesHeader";
import EquipmentChip from "@/components/exercises/CreateExercises/EquipmentChip";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";

const createExercise = () => {
  const theme = useTheme();
  const [exerciseName, setExerciseName] = React.useState<string>("");
  const [equipment, setEquipment] = React.useState<string>("");

  return (
    <View style={{ backgroundColor: theme.colors.surface, flexGrow: 1 }}>
      <CreateExercisesHeader />

      <View style={{ padding: 16, gap: 8 }}>
        <TextInput
          label="Exercise Name"
          value={exerciseName}
          onChangeText={(text) => setExerciseName(text)}
          mode="outlined"
          style={{ marginBottom: 16 }}
        />
        <Text style={{ fontSize: 16, color: theme.colors.primary }}>
          Muscles
        </Text>

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
    </View>
  );
};

const styles = StyleSheet.create({
  contents: {
    flexGrow: 1,
    padding: 32,
    paddingTop: 64,
  },
  chip: {
    width: "50%",
    flexGrow: 1,
  },
});

export default createExercise;
