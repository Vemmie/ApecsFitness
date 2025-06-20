import CreateExercisesHeader from "@/components/exercises/CreateExercises/CreateExercisesHeader";
import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

const createExercise = () => {
  const theme = useTheme();
  return (
    <View style={{ backgroundColor: theme.colors.surface, flexGrow: 1 }}>
      <CreateExercisesHeader />
    </View>
  );
};

export default createExercise;
