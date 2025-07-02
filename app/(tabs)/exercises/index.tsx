import React from "react";

import ThemedAppHeader from "@/components/ThemedAppHeader";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

const index = () => {
  const theme = useTheme();
  console.log("color: ", theme.colors.surface);
  return (
    <View style={{ backgroundColor: theme.colors.surface, flexGrow: 1 }}>
      <ScrollView>
        <ThemedAppHeader title="Exercises" showBackButton={false} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default index;
