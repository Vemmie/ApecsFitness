import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  List,
  Text,
  TextInput,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";

import ThemedAppHeader from "@/components/ThemedAppHeader";
import RecordType from "@/constants/RecordType";
import { fetchExercisesFiltered } from "@/database/models/exercise";
import { fetchWorkoutById, updateWorkout } from "@/database/models/workout";
import { useSQLiteContext } from "expo-sqlite";

const EditWorkout = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const db = useSQLiteContext();

  const [loading, setLoading] = useState(true);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [availableExercises, setAvailableExercises] = useState<any[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Load All Available Exercises for the picker
        const exercises = await fetchExercisesFiltered(db);
        setAvailableExercises(exercises);

        // 2. Load the specific Workout details
        const workout = await fetchWorkoutById(db, Number(id));
        if (workout) {
          setWorkoutName(workout.name);
          setWorkoutDescription(workout.description || "");

          // Map the existing exercises into the selection state
          const mappedExercises = workout.exercises.map((ex) => ({
            id: ex.id.toString(), // The Workout_Exercise join table ID
            exerciseId: ex.exerciseId,
            name: ex.name,
            record_type: ex.recordType,
            sets: ex.sets ?? 0,
            reps: ex.reps ?? 0,
            duration: ex.duration ?? 0,
          }));
          setSelectedExercises(mappedExercises);
        }
      } catch (error) {
        Alert.alert("Error", "Could not load workout data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const goBack = () => router.back();

  const toggleExercise = (exercise: any) => {
    setSelectedExercises((prev) => {
      const isAlreadySelected = prev.some(
        (ex) => ex.exerciseId === exercise.id,
      );

      if (isAlreadySelected) {
        return prev.filter((ex) => ex.exerciseId !== exercise.id);
      } else {
        return [
          ...prev,
          {
            id: Date.now().toString(), // Temporary ID for new additions
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

  const updateExerciseField = (index: number, field: string, value: number) => {
    setSelectedExercises((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSave = async () => {
    if (!workoutName.trim()) {
      Alert.alert("Workout name is required");
      return;
    }

    try {
      await updateWorkout(db, Number(id), {
        name: workoutName,
        description: workoutDescription,
        exercises: selectedExercises,
      });

      Alert.alert("Success", "Workout updated successfully!", [
        { text: "OK", onPress: () => goBack() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update workout.");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <ThemedAppHeader
        title="Edit Workout"
        showBackButton
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
          Modify Exercises
        </Text>

        {availableExercises.map((exercise) => {
          const isSelected = selectedExercises.some(
            (ex) => ex.exerciseId === exercise.id,
          );
          return (
            <List.Item
              key={exercise.id}
              title={exercise.name}
              onPress={() => toggleExercise(exercise)}
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
                marginBottom: 4,
              }}
            />
          );
        })}

        {selectedExercises.length > 0 && (
          <>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.onSurface, marginTop: 20 },
              ]}
            >
              Configure Selected
            </Text>
            {selectedExercises.map((ex, index) => (
              <View
                key={index}
                style={[
                  styles.exerciseRow,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
              >
                <Text style={{ flex: 1, fontWeight: "600" }}>{ex.name}</Text>
                {ex.record_type !== RecordType.TIME ? (
                  <>
                    <TextInput
                      label="Sets"
                      value={String(ex.sets)}
                      keyboardType="numeric"
                      onChangeText={(v) =>
                        updateExerciseField(index, "sets", Number(v))
                      }
                      style={styles.exerciseInput}
                    />
                    <TextInput
                      label="Reps"
                      value={String(ex.reps)}
                      keyboardType="numeric"
                      onChangeText={(v) =>
                        updateExerciseField(index, "reps", Number(v))
                      }
                      style={styles.exerciseInput}
                    />
                  </>
                ) : (
                  <TextInput
                    label="Secs"
                    value={String(ex.duration)}
                    keyboardType="numeric"
                    onChangeText={(v) =>
                      updateExerciseField(index, "duration", Number(v))
                    }
                    style={styles.exerciseInput}
                  />
                )}
              </View>
            ))}
          </>
        )}

        <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
          Update Workout
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: "center", alignItems: "center" },
  scrollContainer: { padding: 16, gap: 12 },
  input: { marginBottom: 8 },
  sectionTitle: { fontWeight: "bold", marginVertical: 8 },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  exerciseInput: { width: 60, height: 40, fontSize: 12 },
  saveButton: { marginTop: 20, marginBottom: 40 },
});

export default EditWorkout;
