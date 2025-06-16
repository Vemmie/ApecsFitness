import { useRouter } from "expo-router";
import React from "react";
import { Appbar, withTheme } from "react-native-paper";

type Props = {};

const ExercisesHeader = ({}: Props) => {
  const router = useRouter();
  const goBack = () => router.navigate("..");

  const handleCreate = () =>
    router.navigate("/(tabs)/exercises/createExercise");

  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={goBack} />
      <Appbar.Content title="Exercises" />
      <Appbar.Action icon="plus" onPress={handleCreate} />
    </Appbar.Header>
  );
};

export default withTheme(ExercisesHeader);
