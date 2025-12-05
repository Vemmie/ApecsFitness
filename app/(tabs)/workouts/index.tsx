import React from "react";

import ThemedAppHeader from "@/components/ThemedAppHeader";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

const workout = () => {
  const router = useRouter();
  const theme = useTheme();
  const handleCreate = () => router.navigate("/(tabs)/workouts/createWorkout");

  return (
    <View style={{ backgroundColor: theme.colors.surface, flexGrow: 1 }}>
      <ThemedAppHeader
        title="Workouts"
        rightIcon="plus"
        rightIconOnPress={handleCreate}
      />
      <ScrollView>
        <Text>Workouts Screen</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contents: { flexGrow: 1, padding: 32, paddingTop: 64 },
});

export default workout;
