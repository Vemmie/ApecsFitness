import React from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView, StyleSheet, View } from "react-native";
const tools = () => {
  return (
    <ThemedView style={styles.contents}>
      <ScrollView>
        <View style={styles.header}>
          <ThemedText>Tools Page</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  contents: { flexGrow: 1, padding: 32, paddingTop: 64 },
  header: { justifyContent: "center", alignContent: "center" },
});

export default tools;
