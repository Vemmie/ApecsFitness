import React from "react";
import { Appbar, withTheme } from "react-native-paper";

type Props = {};

const ExercisesHeader = ({}: Props) => {
  const _goBack = () => console.log("Went back");

  const _handleSearch = () => console.log("Searching");

  const _handleMore = () => console.log("Shown more");

  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={_goBack} />
      <Appbar.Content title="Exercises" />
      <Appbar.Action icon="plus" onPress={_handleMore}></Appbar.Action>
    </Appbar.Header>
  );
};

export default withTheme(ExercisesHeader);
