import React from "react";
import { Appbar, withTheme } from "react-native-paper";

type Props = {};

const ExercisesHeader = ({}: Props) => {
  const goBack = () => console.log("Went back");

  const handleCreate = () => console.log("Shown more");

  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={goBack} />
      <Appbar.Content title="Exercises" />
      <Appbar.Action icon="plus" onPress={handleCreate} />
    </Appbar.Header>
  );
};

export default withTheme(ExercisesHeader);
