import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

import ThemedAppHeader from "@/components/ThemedAppHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ThemedView style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <ThemedAppHeader title="Home" />

      <ScrollView contentContainerStyle={styles.contents}>
        <ThemedText type="title">Welcome Back 💪</ThemedText>

        <View style={styles.buttonGroup}>
          <Button
            mode="contained"
            onPress={() => router.push("/logs/createLog")}
            style={styles.button}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
            icon="plus"
          >
            Create Log
          </Button>

          <Button
            mode="contained-tonal"
            onPress={() => router.push("/logs")}
            style={styles.button}
            icon="format-list-bulleted"
          >
            View Logs
          </Button>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  contents: { padding: 24, gap: 24 },
  buttonGroup: { gap: 16, marginTop: 16 },
  button: { borderRadius: 12, paddingVertical: 6 },
});
