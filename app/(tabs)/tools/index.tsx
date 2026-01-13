import ThemedAppHeader from "@/components/ThemedAppHeader";
import { FontAwesome6 } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

type ToolHref =
  | "/(tabs)/tools/onerep"
  | "/(tabs)/tools/bmi"
  | "/(tabs)/tools/dotsscreen";

const tools: { name: string; href: ToolHref; icon: string }[] = [
  {
    name: "One Rep Calculator",
    href: "/(tabs)/tools/onerep",
    icon: "calculator",
  },
  { name: "BMI Calculator", href: "/(tabs)/tools/bmi", icon: "weight-scale" },
  { name: "DOTs Calculator", href: "/(tabs)/tools/dotsscreen", icon: "trophy" },
];

const IndexPage = () => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <ThemedAppHeader
        title="Tools" // The title for this screen
      />
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: theme.colors.onSurface,
          margin: 12,
        }}
      >
        Select a tool:
      </Text>
      <ScrollView>
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} push asChild>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                margin: 8,
                padding: 12,
                borderRadius: 8,
                // Press feedback handled by opacity below
              }}
            >
              <FontAwesome6
                name={tool.icon}
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
                {tool.name}
              </Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
};

export default IndexPage;
