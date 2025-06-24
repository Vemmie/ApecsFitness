import { useRouter } from "expo-router";
import React from "react";
import { Appbar, useTheme } from "react-native-paper";

type Props = {};

const CreateExercisesHeader = ({}: Props) => {
  const router = useRouter();
  const theme = useTheme();
  const goBack = () => router.navigate("..");

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.surfaceVariant }}>
      <Appbar.BackAction onPress={goBack} />
      <Appbar.Content title="Create new exercise" />
    </Appbar.Header>
  );
};

export default CreateExercisesHeader;
