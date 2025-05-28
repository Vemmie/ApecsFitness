import React from "react";

import ExercisesHeader from "@/components/exercises/ExercisesHeader";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView, StyleSheet } from "react-native";
const exercises = () => {
  return (
    <ThemedView style={styles.contents}>
      <ScrollView>
        <ExercisesHeader />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  // contents: { flexGrow: 1, padding: 32, paddingTop: 64 },
});

export default exercises;
