import { useRouter } from "expo-router";
import React from "react";
import { Appbar, withTheme } from "react-native-paper";

type Props = {};

const CreateExercisesHeader = ({}: Props) => {
  const router = useRouter();
  const goBack = () => router.navigate("..");

  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={goBack} />
      <Appbar.Content title="Create new exercise" />
    </Appbar.Header>
  );
};

export default withTheme(CreateExercisesHeader);
