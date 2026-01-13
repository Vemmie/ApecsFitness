import ThemedAppHeader from "@/components/ThemedAppHeader";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { calculateOneRepMax } from "../../../utils/calculateOneRepMax";
import { isValidPositiveNumberInput } from "../../../utils/isValidPositiveNumberInput";

const OneRep = () => {
  const [result, setResult] = useState(0);
  const [error, setError] = useState(false);
  const [liftData, setLiftData] = useState({ weight: "", reps: "" });

  useEffect(() => {
    if (!isValidPositiveNumberInput(liftData.weight)) {
      setError(true);
      setLiftData((prev) => ({ ...prev, weight: "" }));
      return;
    }
    if (!isValidPositiveNumberInput(liftData.reps)) {
      setError(true);
      setLiftData((prev) => ({ ...prev, reps: "" }));
      return;
    }

    if (error) setResult(0);

    const bothFilled = liftData.weight !== "" && liftData.reps !== "";

    if (bothFilled) {
      setError(false);
      handleCalculation();
    } else {
      setResult(0);
    }
  }, [liftData.weight, liftData.reps]);

  const handleCalculation = () => {
    try {
      const oneRep = calculateOneRepMax(
        Number(liftData.weight),
        Number(liftData.reps),
      );
      setResult(oneRep);
      setError(false);
    } catch {
      setError(true);
    }
  };

  const theme = useTheme();
  const router = useRouter();
  const goBack = () => router.navigate("..");

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <ThemedAppHeader
        title="One Rep Max Calculator"
        showBackButton
        onBackPress={goBack}
      />

      <ScrollView contentContainerStyle={styles.contents}>
        {/* Weight Input */}
        <TextInput
          style={styles.input}
          placeholder="Weight"
          placeholderTextColor="#9b8cff"
          keyboardType="numeric"
          value={liftData.weight}
          onChangeText={(text) =>
            setLiftData((prev) => ({ ...prev, weight: text }))
          }
        />

        {/* Reps Input */}
        <TextInput
          style={styles.input}
          placeholder="Reps"
          placeholderTextColor="#9b8cff"
          keyboardType="numeric"
          value={liftData.reps}
          onChangeText={(text) =>
            setLiftData((prev) => ({ ...prev, reps: text }))
          }
        />

        {error && (
          <Text style={{ color: "red" }}>
            Weight and/or reps must be positive numbers.
          </Text>
        )}

        {result > 0 && (
          <Text style={{ fontWeight: "bold", marginTop: 12 }}>
            Your estimated 1RM is: {result.toFixed(2)} lbs
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contents: {
    padding: 32,
    paddingTop: 64,
  },
  input: {
    borderWidth: 2,
    borderColor: "#7B61FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#f3eaff", // very light purple fill (optional)
    color: "black",
  },
});

export default OneRep;
