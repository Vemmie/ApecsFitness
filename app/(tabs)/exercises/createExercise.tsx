import CreateExercisesHeader from "@/components/exercises/CreateExercises/CreateExercisesHeader";
import EquipmentSelector from "@/components/exercises/CreateExercises/EquipmentSelector";
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

        <EquipmentSelector equipment={equipment} setEquipment={setEquipment} />
        <Text style={{ fontSize: 16, color: theme.colors.primary }}>
          Record Type
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    width: "50%",
    flexGrow: 1,
  },
});

export default createExercise;
