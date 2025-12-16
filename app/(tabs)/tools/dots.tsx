import ThemedAppHeader from "@/components/ThemedAppHeader";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { RadioButton, Text, useTheme } from "react-native-paper";
import { calculateDOTS } from "../../../utils/calculateDOTs";
import { isValidPositiveNumberInput } from "../../../utils/isValidPositiveNumberInput";

const dots = () => {
  const LBS_TO_KG = 0.45359237;
  const [result, setResult] = useState(0);
  const [error, setError] = useState(false);
  const [userData, setUserData] = useState<{
    gender: "male" | "female" | "";
    bodyWeight: string;
    totalLifted: string;
  }>({
    gender: "",
    bodyWeight: "",
    totalLifted: "",
  });

  useEffect(() => {
    // Input validation can be added here
    if (!isValidPositiveNumberInput(userData.bodyWeight)) {
      setError(true);
      setUserData((prev) => ({ ...prev, bodyWeight: "" }));
      return;
    }
    if (!isValidPositiveNumberInput(userData.totalLifted)) {
      setError(true);
      setUserData((prev) => ({ ...prev, totalLifted: "" }));
      return;
    }
    if (error) setResult(0);

    const allFilled =
      userData.gender !== "" &&
      userData.bodyWeight !== "" &&
      userData.totalLifted !== "";

    if (allFilled) {
      setError(false);
      handleCalculation();
    } else {
      setResult(0);
    }
  }, [userData.gender, userData.bodyWeight, userData.totalLifted]);

  const handleCalculation = () => {
    try {
      if (userData.gender === "") return;

      const dots = calculateDOTS(
        userData.gender,
        Number(userData.bodyWeight) * LBS_TO_KG,
        Number(userData.totalLifted) * LBS_TO_KG,
      );

      setResult(dots);
    } catch {
      setError(true);
      setResult(0);
    }
  };

  const theme = useTheme();
  const router = useRouter();
  const goBack = () => router.navigate("..");

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <ThemedAppHeader
        title="DOTS Calculator"
        showBackButton
        onBackPress={goBack}
      />
      <ScrollView contentContainerStyle={styles.contents}>
        {/* Gender Selector */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ marginBottom: 8, fontWeight: "600" }}>Gender</Text>

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
          placeholderTextColor="#9b8cff"
          keyboardType="numeric"
          value={userData.bodyWeight}
          onChangeText={(text) =>
            setUserData((prev) => ({ ...prev, bodyWeight: text }))
          }
        />

        {/* Total Lifted Input */}
        <TextInput
          style={styles.input}
          placeholder="Total Lifted"
          placeholderTextColor="#9b8cff"
          keyboardType="numeric"
          value={userData.totalLifted}
          onChangeText={(text) =>
            setUserData((prev) => ({ ...prev, totalLifted: text }))
          }
        />

        {error && (
          <Text style={{ color: "red" }}>
            Please enter valid bodyweight and total lifted values.
          </Text>
        )}

        {result > 0 && (
          <Text style={{ fontWeight: "bold", marginTop: 12 }}>
            Your DOTS score is: {result.toFixed(2)}
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
    borderColor: "#7B61FF", // 💜 Purple outline like your old version
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#f3eaff", // very light purple fill (optional)
    color: "black",
  },
});

export default dots;
