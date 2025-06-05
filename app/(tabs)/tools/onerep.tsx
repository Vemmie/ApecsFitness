import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { calculateOneRepMax } from "../../../utils/calculateOneRepMax";

const onerep = () => {
  // states
  const [result, setResult] = useState(0);
  const [error, setError] = useState("");
  const [liftData, setLiftData] = useState({
    weight: "",
    reps: "",
  });

  // function for on event handler to calculate the max rep
  const handleCalculation = () => {
    try {
      const oneRep = calculateOneRepMax(
        Number(liftData.weight),
        Number(liftData.reps),
      );
      setResult(oneRep);
      setError("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <ThemedView style={styles.contents}>
      <ScrollView>
        <View style={styles.header}>
          <ThemedText>One Rep Max Page</ThemedText>
          {/*This is the text input form for both the weight and reps*/}
          <TextInput
            //style needed
            keyboardType="numeric"
            onChangeText={(text) =>
              setLiftData((prev) => ({
                ...prev,
                weight: text,
              }))
            }
            value={liftData.weight.toString()}
            placeholder="weight"
          />
          <TextInput
            //style needed
            keyboardType="numeric"
            onChangeText={(text) =>
              setLiftData((prev) => ({
                ...prev,
                reps: text,
              }))
            }
            value={liftData.reps.toString()}
            placeholder="reps"
          />
        </View>
        {/*Button to call handle calculation*/}
        <TouchableOpacity onPress={handleCalculation}>
          <Text>Calculate</Text>
        </TouchableOpacity>
        {/*This is the conditional display if theres an error or the result*/}
        {error !== "" && <Text style={{ color: "red" }}>{error}</Text>}
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
