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

const onerep = () => {
  // states
  const [result, setResult] = useState(0);
  const [error, setError] = useState(false);
  const [liftData, setLiftData] = useState({
    weight: "",
    reps: "",
  });

  useEffect(() => {
    // Only attempt calculation if both weight and reps have values
    if (liftData.weight !== "" && liftData.reps !== "") {
      if (Number(liftData.weight) < 1) {
        setError(true);
        setLiftData((prev) => ({
          ...prev,
          weight: "",
        }));
      }
      if (Number(liftData.reps) < 1) {
        setError(true);
        setLiftData((prev) => ({
          ...prev,
          reps: "",
        }));
      }
      handleCalculation();
    } else if (error) {
      // do nothing if there's an error
    } else {
      // Clear result and error if inputs are empty
      setResult(0);
      setError(false);
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
        {error === true && (
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
