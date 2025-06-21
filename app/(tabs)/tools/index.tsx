import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link, Stack } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function Tools() {
  const theme = useTheme();
  return (
    <View style={[styles.contents, { backgroundColor: theme.colors.surface }]}>
      <Stack.Screen options={{ title: "Tools" }} />
      <ScrollView>
        <Text style={[styles.text, { color: theme.colors.primary }]}>
          Select:
        </Text>
        <Link href="/(tabs)/tools/onerep" push asChild>
          <Pressable style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome6
              name="calculator"
              size={24}
              color={theme.colors.primary}
            />
            <Text
              style={{
                marginTop: 4,
                paddingLeft: 10,
                color: theme.colors.secondary,
              }}
            >
              One Rep Calculator
            </Text>
          </Pressable>
        </Link>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contents: { flexGrow: 1, padding: 32, paddingTop: 64 },
  text: { fontWeight: "bold", paddingBottom: 16, fontSize: 20 },
});
