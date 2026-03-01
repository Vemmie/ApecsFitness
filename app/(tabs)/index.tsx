import { useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";

import ThemedAppHeader from "@/components/ThemedAppHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  const handleDummyLog = () => {
    console.log("Log Workout pressed");
    // later you can route:
    // router.push("/workouts/log");
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedAppHeader title="Home" />

      <ScrollView contentContainerStyle={styles.contents}>
        <ThemedText type="title">Welcome Back 💪</ThemedText>

        <Button
          mode="contained"
          onPress={handleDummyLog}
          style={styles.button}
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
        >
          Log Workout
        </Button>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  contents: {
    padding: 24,
    gap: 24,
  },
  button: {
    borderRadius: 12,
  },
});
