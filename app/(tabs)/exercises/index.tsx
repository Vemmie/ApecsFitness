import React from "react";

import ExercisesHeader from "@/components/exercises/ExercisesHeader";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

const index = () => {
  const theme = useTheme();
  return (
    <View style={{ backgroundColor: theme.colors.surface, flexGrow: 1 }}>
      <ScrollView>
        <ExercisesHeader />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default index;
