import React from "react";

import ExercisesHeader from "@/components/exercises/ExercisesHeader";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView, StyleSheet } from "react-native";
const index = () => {
  return (
    <ThemedView>
      <ScrollView>
        <ExercisesHeader />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({});

export default index;
