import { Pressable, ScrollView, Text } from "react-native";
import { useTheme } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import Link from "expo-router/build/components/Link";

// Define your tools in an array for easy management
const tools = [
  {
    name: "One Rep Calculator",
    href: "/(tabs)/tools/onerep",
    icon: "calculator",
  },
  {
    name: "BMI Calculator",
    href: "/(tabs)/tools/bmi",
    icon: "scale",
  },
  {
    name: "DOTs Calculator",
    href: "/(tabs)/tools/dotsscreen",
    icon: "trophy",
  },
];

const ToolLinks = () => {
  const theme = useTheme();

  return (
    <ScrollView>
      {tools.map((tool) => (
        <Link key={tool.href} href={tool.href} push asChild>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <FontAwesome6 name={tool.icon} size={24} color={theme.colors.primary} />
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
  );
};

export default ToolLinks;
