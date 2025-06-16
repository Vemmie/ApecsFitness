import CreateExercisesHeader from "@/components/exercises/CreateExercises/CreateExercisesHeader";
import React from "react";
import { View } from "react-native";
import { withTheme } from "react-native-paper";

const createExercise = () => {
  return (
    <View>
      <CreateExercisesHeader />
    </View>
  );
};

export default withTheme(createExercise);
