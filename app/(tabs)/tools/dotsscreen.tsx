import ThemedAppHeader from "@/components/ThemedAppHeader";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { RadioButton, Text, useTheme } from "react-native-paper";
import { calculateDOTS } from "../../../utils/calculateDOTs";
import { isValidPositiveNumberInput } from "../../../utils/isValidPositiveNumberInput";

const MAX_BODYWEIGHT_LBS = 600;
const MAX_TOTAL_LIFTED_LBS = 3000;

const dotsscreen = () => {
  const theme = useTheme();
  const router = useRouter();

  const [result, setResult] = useState<number | null>(null);

  // Track field-level errors
  const [fieldErrors, setFieldErrors] = useState<{
    bodyWeight?: string;
    totalLifted?: string;
  }>({});

  // Track calculation/backend errors
  const [calculationError, setCalculationError] = useState<string | null>(null);

  const [userData, setUserData] = useState<{
    gender: "male" | "female" | "";
    bodyWeight: string;
    totalLifted: string;
  }>({
    gender: "",
    bodyWeight: "",
    totalLifted: "",
  });

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
          marginBottom: 8,
          backgroundColor: theme.colors.background,
          color: theme.colors.onSurface,
        },
        label: {
          marginBottom: 8,
          fontWeight: "600",
          color: theme.colors.onSurface,
        },
        errorText: {
          color: theme.colors.error,
          marginBottom: 8,
        },
        resultText: {
          fontWeight: "bold",
          marginTop: 12,
          color: theme.colors.onSurface,
        },
        warningText: {
          color: theme.colors.secondary,
          marginBottom: 8,
        },
      }),
    [theme],
  );

  useEffect(() => {
    const { gender, bodyWeight, totalLifted } = userData;

    const newFieldErrors: typeof fieldErrors = {};
    let hasFieldError = false;

    if (!gender) {
      hasFieldError = true;
    }

    if (!isValidPositiveNumberInput(bodyWeight)) {
      newFieldErrors.bodyWeight = "Enter a valid bodyweight";
      hasFieldError = true;
    } else if (Number(bodyWeight) > MAX_BODYWEIGHT_LBS) {
      newFieldErrors.bodyWeight = `Bodyweight must be ≤ ${MAX_BODYWEIGHT_LBS} lbs`;
      hasFieldError = true;
    }

    if (!isValidPositiveNumberInput(totalLifted)) {
      newFieldErrors.totalLifted = "Enter a valid total lifted weight";
      hasFieldError = true;
    } else if (Number(totalLifted) > MAX_TOTAL_LIFTED_LBS) {
      newFieldErrors.totalLifted = `Total lifted must be ≤ ${MAX_TOTAL_LIFTED_LBS} lbs`;
      hasFieldError = true;
    }

    setFieldErrors(newFieldErrors);

    if (hasFieldError) {
      setResult(null);
      setCalculationError(null);
      return;
    }

    if (gender === "male" || gender === "female") {
      try {
        const dots = calculateDOTS(
          gender,
          Number(bodyWeight),
          Number(totalLifted),
        );
        setResult(dots);
        setCalculationError(null);
      } catch (err: any) {
        setResult(null);
        setCalculationError(err?.message || "Calculation failed");
      }
    } else {
      setResult(null);
      setCalculationError("Please select a gender");
    }
  }, [userData]);

  return (
    <View style={styles.container}>
      <ThemedAppHeader
        title="DOTS Calculator"
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.contents}>
        {/* Gender Selector */}
        <View style={{ marginBottom: 24 }}>
          <Text style={styles.label}>Gender</Text>
          <RadioButton.Group
            onValueChange={(value) =>
              setUserData((prev) => ({
                ...prev,
                gender: value as "male" | "female",
              }))
            }
            value={userData.gender}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value="male" />
              <Text style={{ marginRight: 24 }}>Male</Text>

              <RadioButton value="female" />
              <Text>Female</Text>
            </View>
          </RadioButton.Group>
        </View>

        {/* Bodyweight Input */}
        <TextInput
          style={styles.input}
          placeholder="Bodyweight"
          placeholderTextColor={theme.colors.onSurfaceVariant}
          keyboardType="numeric"
          value={userData.bodyWeight}
          onChangeText={(text) =>
            setUserData((prev) => ({ ...prev, bodyWeight: text }))
          }
        />
        {fieldErrors.bodyWeight && (
          <Text style={styles.errorText}>{fieldErrors.bodyWeight}</Text>
        )}

        {/* Total Lifted Input */}
        <TextInput
          style={styles.input}
          placeholder="Total Lifted"
          placeholderTextColor={theme.colors.onSurfaceVariant}
          keyboardType="numeric"
          value={userData.totalLifted}
          onChangeText={(text) =>
            setUserData((prev) => ({ ...prev, totalLifted: text }))
          }
        />
        {fieldErrors.totalLifted && (
          <Text style={styles.errorText}>{fieldErrors.totalLifted}</Text>
        )}

        {/* Calculation / Backend Error */}
        {calculationError && (
          <Text style={styles.errorText}>{calculationError}</Text>
        )}

        {/* Result */}
        {result !== null && (
          <Text style={styles.resultText}>
            Your DOTS score is: {result.toFixed(2)}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default dotsscreen;
