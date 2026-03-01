import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, List, Text, TextInput, useTheme } from "react-native-paper";

import ThemedAppHeader from "@/components/ThemedAppHeader";
import RecordType from "@/constants/RecordType";
import { fetchExercisesFiltered } from "@/database/models/exercise";
import {
  insertWorkout,
  insertWorkoutExercise,
} from "@/database/models/workout";
import { useSQLiteContext } from "expo-sqlite";

const CreateWorkout = () => {
  const router = useRouter();
  const theme = useTheme();
  const db = useSQLiteContext();

  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [availableExercises, setAvailableExercises] = useState<any[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);

  // Fetch exercises from DB on mount
  useEffect(() => {
    const loadExercises = async () => {
      const exercises = await fetchExercisesFiltered(db);
      setAvailableExercises(exercises);
    };
    loadExercises();
  }, []);

  const goBack = () => router.navigate("..");

  const addExercise = (exercise: any) => {
    setSelectedExercises((prev) => {
      // Check if the exercise is already selected
      const isAlreadySelected = prev.some(
        (ex) => ex.exerciseId === exercise.id,
      );

      if (isAlreadySelected) {
        // Remove it if it exists (Unselect)
        return prev.filter((ex) => ex.exerciseId !== exercise.id);
      } else {
        // Add it if it doesn't exist
        return [
          ...prev,
          {
            // Note: Use a unique ID or index for the key,
            // but keep exerciseId for tracking the relation
            id: exercise.id.toString(),
            exerciseId: exercise.id,
            name: exercise.name,
            record_type: exercise.record_type,
            sets: 3,
            reps: 10,
            duration: exercise.record_type === RecordType.TIME ? 30 : 0,
          },
        ];
      }
    });
  };

  const updateExercise = (
    index: number,
    field: "sets" | "reps" | "duration",
    value: number,
  ) => {
    setSelectedExercises((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const saveWorkout = async () => {
    if (!workoutName.trim()) {
      Alert.alert("Workout name is required");
      return;
    }

    try {
      const workoutId = await insertWorkout(db, {
        name: workoutName,
        description: workoutDescription,
      });

      for (let i = 0; i < selectedExercises.length; i++) {
        await insertWorkoutExercise(db, workoutId, selectedExercises[i], i);
      }

      Alert.alert("Success", "Workout created successfully!");
      goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create workout.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <ThemedAppHeader
        title="Create Workout Plans"
        showBackButton={true}
        onBackPress={goBack}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          label="Workout Name"
          value={workoutName}
          onChangeText={setWorkoutName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Description"
          value={workoutDescription}
          onChangeText={setWorkoutDescription}
          mode="outlined"
          multiline
          style={styles.input}
        />

        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Select Exercises
        </Text>
        {availableExercises.map((exercise) => {
          // Check if this specific exercise is in our selected list
          const isSelected = selectedExercises.some(
            (ex) => ex.exerciseId === exercise.id,
          );

          return (
            <List.Item
              key={exercise.id}
              title={exercise.name}
              description={`Type: ${exercise.record_type}`}
              onPress={() => addExercise(exercise)}
              // Change the icon or color based on selection
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={isSelected ? "check-circle" : "dumbbell"}
                  color={isSelected ? theme.colors.primary : props.color}
                />
              )}
              style={{
                backgroundColor: isSelected
                  ? theme.colors.primaryContainer
                  : "transparent",
                borderRadius: 8,
              }}
              titleStyle={{
                color: isSelected
                  ? theme.colors.onPrimaryContainer
                  : theme.colors.onSurface,
              }}
            />
          );
        })}

        {selectedExercises.length > 0 && (
          <>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Workout Details
            </Text>
            {selectedExercises.map((ex, index) => (
              <View
                key={ex.id}
                style={[
                  styles.exerciseRow,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    borderRadius: 8,
                  },
                ]}
              >
                <Text
                  style={{
                    flex: 1,
                    fontWeight: "600",
                    color: theme.colors.onSurfaceVariant,
                  }}
                >
                  {ex.name}
                </Text>
                {["sets", "reps", "duration"].map((field) => {
                  if (
                    (field === "duration" && ex.duration !== 0) ||
                    (field !== "duration" && ex.sets !== 0)
                  ) {
                    return (
                      <TextInput
                        key={field}
                        label={field}
                        value={String(ex[field as keyof typeof ex])}
                        keyboardType="numeric"
                        onChangeText={(text) =>
                          updateExercise(index, field as any, Number(text))
                        }
                        style={styles.exerciseInput}
                        mode="flat"
                      />
                    );
                  }
                  return null;
                })}
              </View>
            ))}
          </>
        )}

        <Button
          mode="contained"
          onPress={saveWorkout}
          style={styles.saveButton}
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
        >
          Save Workout
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 16, gap: 16 },
  input: { marginBottom: 8 },
  sectionTitle: { fontWeight: "bold", marginVertical: 8 },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    padding: 12, // Increased padding slightly for better touch targets
  },
  exerciseInput: { width: 65, height: 45 }, // Adjusted height to look better with flat mode
  saveButton: { marginTop: 16 },
});

export default CreateWorkout;
