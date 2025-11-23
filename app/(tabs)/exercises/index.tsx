import React from "react";

import ThemedAppHeader from "@/components/ThemedAppHeader";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

const index = () => {
  const router = useRouter();
  const theme = useTheme();

  const handleCreate = () =>
    router.navigate("/(tabs)/exercises/createExercise");
  return (
    <View style={{ backgroundColor: theme.colors.surface, flexGrow: 1 }}>
      <ScrollView>
        <ThemedAppHeader
          title="Exercises"
          showBackButton={true}
          rightIcon="plus"
          rightIconOnPress={handleCreate}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default index;
