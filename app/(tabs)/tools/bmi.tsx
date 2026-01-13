import ThemedAppHeader from "@/components/ThemedAppHeader";
import { calculateBMI } from "@/utils/calculateBMI";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { isValidPositiveNumberInput } from "../../../utils/isValidPositiveNumberInput";

const BmiCalc = () => {
  const [result, setResult] = useState(0);
  const [error, setError] = useState(false);
  const [bmiData, setBmiData] = useState({ weight: "", height: "" });

  const theme = useTheme();
  const router = useRouter();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.surface,
        },
        contents: {
          padding: 32,
          paddingTop: 64,
        },
        input: {
          borderWidth: 2,
          borderColor: theme.colors.primary,
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          backgroundColor: theme.colors.background,
          color: theme.colors.onSurface,
        },
        errorText: {
          color: theme.colors.error,
          marginBottom: 16,
        },
        resultContainer: {
          marginTop: 24,
          alignItems: "center",
          padding: 16,
          borderRadius: 12,
          backgroundColor: theme.colors.secondaryContainer,
        },
        resultText: {
          fontWeight: "bold",
          fontSize: 18,
          color: theme.colors.onSecondaryContainer,
        },
        categoryText: {
          marginTop: 8,
          color: theme.colors.onSecondaryContainer,
        },
      }),
    [theme],
  );

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

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <ThemedAppHeader
        title="BMI Calculator"
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.contents}>
        {/* Weight Input */}
        <TextInput
          style={styles.input}
          placeholder="Weight (lbs)"
          placeholderTextColor={theme.colors.onSurfaceVariant}
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
          placeholderTextColor={theme.colors.onSurfaceVariant}
          keyboardType="numeric"
          value={bmiData.height}
          onChangeText={(text) =>
            setBmiData((prev) => ({ ...prev, height: text }))
          }
        />

        {error && (
          <Text style={styles.errorText}>
            Weight and height must be positive numbers.
          </Text>
        )}

        {result !== null && !error && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Your BMI: {result.toFixed(1)}</Text>
            <Text style={styles.categoryText}>{getBMICategory(result)}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default BmiCalc;
