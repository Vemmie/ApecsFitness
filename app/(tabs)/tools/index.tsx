import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link, Stack } from "expo-router";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export default function Tools() {
  const theme = useTheme();
  return (
    <ThemedView style={styles.contents}>
      <Stack.Screen options={{ title: "Tools" }} />
      <ScrollView>
        <ThemedText>Select: </ThemedText>
        <Link href="/(tabs)/tools/onerep" push asChild>
          <Pressable style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome6
              name="calculator"
              size={24}
              color={theme.colors.primary}
            />
            <ThemedText style={{ marginTop: 4, paddingLeft: 4 }}>
              One Rep Calculator
            </ThemedText>
          </Pressable>
        </Link>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  contents: { flexGrow: 1, padding: 32, paddingTop: 64 },
});
