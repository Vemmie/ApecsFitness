import { Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Chip,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

import ThemedAppHeader from "@/components/ThemedAppHeader";
import { Exercise, fetchExercisesFiltered } from "@/database/models/exercise";
import {
  fetchWorkoutsContainingExercise,
  insertLog,
} from "@/database/models/log";

export default function CreateLogScreen() {
  const theme = useTheme();
  const db = useSQLiteContext();
  const router = useRouter();

  // State
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );

  // Workouts containing the selected exercise
  const [availableWorkouts, setAvailableWorkouts] = useState<
    { workoutId: number; workoutName: string; workoutExerciseId: number }[]
  >([]);
  const [selectedWorkoutExId, setSelectedWorkoutExId] = useState<number | null>(
    null,
  );

  // Log Stats
  const [sets, setSets] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [duration, setDuration] = useState("");

  // 1. Load all exercises on mount
  useEffect(() => {
    fetchExercisesFiltered(db)
      .then((data) => {
        setExercises(data);
      })
      .catch((err) => console.error("Error fetching exercises:", err))
      .finally(() => setLoading(false));
  }, [db]);

  // 2. When an exercise is selected, fetch the relevant workouts
  useEffect(() => {
    const exerciseId = selectedExercise?.id;

    if (exerciseId) {
      const loadWorkouts = async () => {
        try {
          const data = await fetchWorkoutsContainingExercise(db, exerciseId);
          setAvailableWorkouts(data);
          setSelectedWorkoutExId(null);
        } catch (error) {
          console.error("Error fetching available workouts:", error);
        }
      };

      loadWorkouts();

      // Reset input fields when switching exercises
      setSets("");
      setWeight("");
      setReps("");
      setDuration("");
    } else {
      setAvailableWorkouts([]);
      setSelectedWorkoutExId(null);
    }
  }, [selectedExercise, db]);

  const handleSave = async () => {
    if (!selectedExercise?.id) return;

    try {
      await insertLog(db, {
        exerciseId: selectedExercise.id,
        workoutExerciseId: selectedWorkoutExId, // number | null is now allowed
        sets: sets ? parseInt(sets) : null,
        weight: weight ? parseFloat(weight) : null,
        reps: reps ? parseInt(reps) : null,
        duration: duration ? parseFloat(duration) : null,
      });
      Alert.alert("Success", "Log saved!");
      router.back();
    } catch (error) {
      console.error("Error saving log:", error);
      Alert.alert("Error", "Failed to save log.");
    }
  };

  // UI Logic: Handle Loading
  if (loading) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.surface }]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // UI Logic: Handle Empty Exercises (Hey man, create one!)
  if (exercises.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ThemedAppHeader
          title="Log Exercise"
          showBackButton
          onBackPress={() => router.back()}
        />
        <View style={styles.emptyContainer}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            Hey man, no exercises found!
          </Text>
          <Text variant="bodyMedium" style={styles.emptySub}>
            You need to create an exercise before you can log a workout.
          </Text>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => router.push("/exercises")} // Adjust to your exercise list/create path
            style={styles.emptyButton}
          >
            Go to Exercises
          </Button>
        </View>
      </View>
    );
  }

  // Logic for dynamic inputs
  const normalizedType = selectedExercise?.record_type?.toLowerCase() || "";
  const isTimeBased = normalizedType.includes("time");

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <Stack.Screen options={{ headerShown: false }} />

      <ThemedAppHeader
        title="Log Exercise"
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* STEP 1: PICK EXERCISE */}
        <Text variant="titleMedium" style={styles.label}>
          1. Select Exercise
        </Text>
        <View style={styles.chipRow}>
          {exercises.map((ex) => (
            <Chip
              key={ex.id}
              selected={selectedExercise?.id === ex.id}
              showSelectedOverlay
              onPress={() => setSelectedExercise(ex)}
              style={styles.chip}
            >
              {ex.name}
            </Chip>
          ))}
        </View>

        {/* STEP 2: PICK WORKOUT (Optional) */}
        {selectedExercise && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.label}>
              2. Select Workout (Optional)
            </Text>
            <View style={styles.chipRow}>
              <Chip
                selected={selectedWorkoutExId === null}
                showSelectedOverlay
                onPress={() => setSelectedWorkoutExId(null)}
                style={styles.chip}
              >
                None (Freestyle)
              </Chip>
              {availableWorkouts.map((w) => (
                <Chip
                  key={w.workoutExerciseId}
                  selected={selectedWorkoutExId === w.workoutExerciseId}
                  showSelectedOverlay
                  onPress={() => setSelectedWorkoutExId(w.workoutExerciseId)}
                  style={styles.chip}
                >
                  {w.workoutName}
                </Chip>
              ))}
            </View>
          </View>
        )}

        {/* STEP 3: DYNAMIC INPUT FIELDS */}
        {selectedExercise && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.label}>
              3. Enter Stats
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

            <Button
              mode="contained"
              onPress={handleSave}
              style={{ marginTop: 16 }}
            >
              Save Log
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  section: { marginTop: 24 },
  label: { marginBottom: 12, fontWeight: "bold" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { marginBottom: 4 },
  input: { marginBottom: 12, backgroundColor: "transparent" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: { fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  emptySub: { textAlign: "center", opacity: 0.7, marginBottom: 24 },
  emptyButton: { borderRadius: 12 },
});
