import ThemedAppHeader from "@/components/ThemedAppHeader";
import { calculateBMI } from "@/utils/calculateBMI";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { isValidPositiveNumberInput } from "../../../utils/isValidPositiveNumberInput";

const BmiCalc = () => {
  const [result, setResult] = useState(0);
  const [error, setError] = useState(false);
  const [bmiData, setBmiData] = useState({ weight: "", height: "" });

  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    // 1. Validate Weight
    if (bmiData.weight !== "" && !isValidPositiveNumberInput(bmiData.weight)) {
      setError(true);
      return;
    }

    // 2. Validate Height
    if (bmiData.height !== "" && !isValidPositiveNumberInput(bmiData.height)) {
      setError(true);
      return;
    }

    const bothFilled = bmiData.weight !== "" && bmiData.height !== "";

    if (bothFilled) {
      setError(false);
      handleCalculation();
    } else {
      setResult(0);
      setError(false);
    }
  }, [bmiData.weight, bmiData.height]);

  const handleCalculation = () => {
    try {
      // Assuming calculateBMI takes (weight, height)
      const bmi = calculateBMI(Number(bmiData.weight), Number(bmiData.height));
      setResult(bmi);
      setError(false);
    } catch {
      setError(true);
    }
  };

  const goBack = () => router.navigate("..");

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <ThemedAppHeader
        title="BMI Calculator"
        showBackButton
        onBackPress={goBack}
      />

      <ScrollView contentContainerStyle={styles.contents}>
        {/* Weight Input */}
        <TextInput
          style={styles.input}
          placeholder="Weight (lbs)"
          placeholderTextColor="#9b8cff"
          keyboardType="numeric"
          value={bmiData.weight}
          onChangeText={(text) =>
            setBmiData((prev) => ({ ...prev, weight: text }))
          }
        />

        {/* Height Input */}
        <TextInput
          style={styles.input}
          placeholder="Height (in)"
          placeholderTextColor="#9b8cff"
          keyboardType="numeric"
          value={bmiData.height}
          onChangeText={(text) =>
            setBmiData((prev) => ({ ...prev, height: text }))
          }
        />

        {error && (
          <Text style={{ color: "red" }}>
            Weight and height must be positive numbers.
          </Text>
        )}

        {result > 0 && !error && (
          <View style={styles.resultContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Your BMI: {result.toFixed(1)}
            </Text>
            <Text style={{ marginTop: 8 }}>{getBMICategory(result)}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Optional helper for UX
const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
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
    backgroundColor: "#f3eaff",
    color: "black",
  },
  resultContainer: {
    marginTop: 24,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#b6a6a6",
  },
});

export default BmiCalc;
