import { useRouter } from "expo-router";
import React from "react";
import { Appbar, useTheme } from "react-native-paper";

type Props = {};

const ExercisesHeader = ({}: Props) => {
  const router = useRouter();
  const theme = useTheme();
  const goBack = () => router.navigate("..");

  const handleCreate = () =>
    router.navigate("/(tabs)/exercises/createExercise");

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.surfaceVariant }}>
      <Appbar.BackAction onPress={goBack} />
      <Appbar.Content title="Exercises" />
      <Appbar.Action icon="plus" onPress={handleCreate} />
    </Appbar.Header>
  );
};

export default ExercisesHeader;
