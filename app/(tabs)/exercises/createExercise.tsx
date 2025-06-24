import ThemedAppHeader from "@/components/ThemedAppHeader";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

const createExercise = () => {
  const theme = useTheme();
  const router = useRouter();
  const goBack = () => router.navigate("..");
  return (
    <View style={{ backgroundColor: theme.colors.surface, flexGrow: 1 }}>
      <ThemedAppHeader
        title="Create Exercise" // The title for this screen
        showBackButton={true} // Show the back button
        onBackPress={goBack} // Pass the specific back action
      />
    </View>
  );
};

export default createExercise;
