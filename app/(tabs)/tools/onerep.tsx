import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
// Import Paper components
import {
  TextInput as PaperTextInput,
  Text,
  useTheme, // To access the theme
} from "react-native-paper";
import { calculateOneRepMax } from "../../../utils/calculateOneRepMax";
import { isValidPositiveNumberInput } from "../../../utils/isValidPositiveNumberInput";

const onerep = () => {
  // states
  const [result, setResult] = useState(0);
  const [error, setError] = useState(false);
  const [liftData, setLiftData] = useState({
    weight: "",
    reps: "",
  });

  useEffect(() => {
    // ---- Validation Logic ----
    if (!isValidPositiveNumberInput(liftData.weight)) {
      setError(true);
      setLiftData((prev) => ({
        ...prev,
        weight: "",
      }));
      return;
    }
    if (!isValidPositiveNumberInput(liftData.reps)) {
      setError(true);
      setLiftData((prev) => ({
        ...prev,
        reps: "",
      }));
      return;
    }

    // If there's an error reset the result to
    if (error) {
      setResult(0);
    }

    const bothFilled = liftData.weight !== "" && liftData.reps !== "";
    // UI and Calculation based on Validation
    if (bothFilled) {
      setError(false);
      handleCalculation();
    } else {
      setResult(0);
    }
  }, [liftData.weight, liftData.reps]);

  // function for on event handler to calculate the max rep
  const handleCalculation = () => {
    try {
      const oneRep = calculateOneRepMax(
        Number(liftData.weight),
        Number(liftData.reps),
      );
      setResult(oneRep);
      setError(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(true);
      }
    }
  };

  const theme = useTheme();

  return (
    <ThemedView style={styles.contents}>
      <ScrollView>
        <View style={styles.header}>
          <ThemedText>One Rep Max Page</ThemedText>
          {/*This is the text input form for both the weight and reps*/}
          <PaperTextInput
            //style needed
            inputMode="numeric"
            keyboardType="numeric"
            onChangeText={(text) =>
              setLiftData((prev) => ({
                ...prev,
                weight: text,
              }))
            }
            value={liftData.weight.toString()}
            placeholder="Weight"
          />
          <PaperTextInput
            //style needed
            inputMode="numeric"
            keyboardType="numeric"
            onChangeText={(text) =>
              setLiftData((prev) => ({
                ...prev,
                reps: text,
              }))
            }
            value={liftData.reps.toString()}
            placeholder="Reps"
          />
        </View>
        {/*This is the conditional display if theres an error or the result*/}
        {error && (
          <Text style={{ color: "red" }}>
            "Weight and/or reps must be positive numbers."
          </Text>
        )}
        {result > 0 && (
          <Text>Your estimated 1RM is: {result.toFixed(2)} lbs</Text>
        )}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  contents: { flexGrow: 1, padding: 32, paddingTop: 64 },
  header: { justifyContent: "center", alignContent: "center" },
});

export default onerep;
