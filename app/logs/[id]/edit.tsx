import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

import ThemedAppHeader from "@/components/ThemedAppHeader";
import { fetchtExerciseById } from "@/database/models/exercise";
import { fetchLogById, updateLog } from "@/database/models/log";

export default function EditLogScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const db = useSQLiteContext();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [recordType, setRecordType] = useState<string>("");

  const [sets, setSets] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const logId = Number(id);
        const logData = await fetchLogById(db, logId);

        if (logData) {
          // Fetch the exercise to check the record_type text column
          const exerciseData = await fetchtExerciseById(db, logData.exerciseId);

          // Normalize the string to lowercase to avoid casing mismatches
          const typeFromDb = exerciseData?.record_type?.toLowerCase() || "";
          setRecordType(typeFromDb);

          setSets(logData.sets ? String(logData.sets) : "");
          setWeight(logData.weight ? String(logData.weight) : "");
          setReps(logData.reps ? String(logData.reps) : "");
          setDuration(logData.duration ? String(logData.duration) : "");
        }
      } catch (error) {
        console.error("Failed to load log:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id, db]);

  const handleSave = async () => {
    try {
      await updateLog(db, Number(id), {
        sets: sets ? parseInt(sets) : null,
        weight: weight ? parseFloat(weight) : null,
        reps: reps ? parseInt(reps) : null,
        duration: duration ? parseFloat(duration) : null,
      });
      router.back();
    } catch (error) {
      Alert.alert("Error", "Could not save changes");
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.surface }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Determine which fields to show based on the TEXT in the record_type column
  const isTimeBased = recordType.includes("time");

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedAppHeader
        title="Edit Log"
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="titleMedium" style={{ marginBottom: 16 }}>
          Update Stats
        </Text>

        {!isTimeBased ? (
          <>
            <TextInput
              label="Sets"
              value={sets}
              onChangeText={setSets}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Weight (lbs)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Reps"
              value={reps}
              onChangeText={setReps}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
          </>
        ) : (
          <TextInput
            label="Duration (seconds)"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />
        )}

        <Button mode="contained" onPress={handleSave} style={{ marginTop: 24 }}>
          Save Changes
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 16 },
  input: { marginBottom: 16, backgroundColor: "transparent" },
});
