import { useRouter } from "expo-router";
import React from "react";

// Ui imports
import ThemedAppHeader from "@/components/ThemedAppHeader";
import { ScrollView, View } from "react-native";
import { TextInput, useTheme } from "react-native-paper";

const createWorkout = () => {
  const router = useRouter();
  const theme = useTheme();
  const goBack = () => router.navigate("..");
  const [workoutName, setWorkoutName] = React.useState<string>("");
  // Note you need to add set and rep options / duration
  // Also get the list of exercises to add to the workout
  // Create hooks in a separate file to handle the logic
  return (
    <View style={{ backgroundColor: theme.colors.surface, flexShrink: 1 }}>
      <ThemedAppHeader
        title="Create Workout Plans" // The title for this screen
        showBackButton={true} // Show the back button
        onBackPress={goBack} // Pass the specific back action
      />
      <ScrollView style={{ flexShrink: 1 }}>
        <View style={{ padding: 16, gap: 24, flexShrink: 1 }}>
          <TextInput
            label="Workout Name"
            value={workoutName}
            onChangeText={(text) => setWorkoutName(text)}
            mode="outlined"
            style={{ marginBottom: 16 }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default createWorkout;
