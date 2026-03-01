import ThemedAppHeader from "@/components/ThemedAppHeader";
import type { WorkoutWithExercises } from "@/database/models/workout";
import { fetchWorkoutsWithExercises } from "@/database/models/workout";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Card,
  Chip,
  Divider,
  Text,
  useTheme,
} from "react-native-paper";

const WorkoutDetailPage = () => {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const db = useSQLiteContext();

  const [workout, setWorkout] = useState<WorkoutWithExercises | null>(null);
  const [loading, setLoading] = useState(true);

  const goBack = () => router.back();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const workouts = await fetchWorkoutsWithExercises(db);
        const foundWorkout = workouts.find((w) => w.id === Number(id));
        setWorkout(foundWorkout || null);
      } catch (error) {
        console.error("Error fetching workout details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.surface }]}
      >
        <ActivityIndicator animating={true} color={theme.colors.primary} />
      </View>
    );
  }

  if (!workout) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.surface }]}
      >
        <Text style={{ color: theme.colors.error }}>Workout not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <ThemedAppHeader
        title="Workout Details"
        showBackButton={true}
        onBackPress={goBack}
        rightIcon="pencil"
        rightIconOnPress={() => {
          console.log("Edit workout", id);
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text
            variant="headlineMedium"
            style={[styles.workoutTitle, { color: theme.colors.onSurface }]}
          >
            {workout.name}
          </Text>
          {workout.description && (
            <Text
              variant="bodyMedium"
              style={[
                styles.description,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {workout.description}
            </Text>
          )}
          <View style={styles.chipRow}>
            <Chip
              icon="dumbbell"
              mode="flat"
              textStyle={{ color: theme.colors.primary }}
              style={[
                styles.chip,
                { backgroundColor: theme.colors.secondaryContainer },
              ]}
            >
              {workout.exercises.length} Exercise
              {workout.exercises.length !== 1 ? "s" : ""}
            </Chip>
          </View>
        </View>

        <Divider
          style={{
            backgroundColor: theme.colors.outlineVariant,
            marginVertical: 16,
          }}
        />

        {/* Exercises List */}
        <Text
          variant="titleLarge"
          style={[
            styles.sectionTitle,
            { color: theme.colors.onSurface, marginBottom: 12 },
          ]}
        >
          Exercises
        </Text>

        {workout.exercises.map((exercise, index) => (
          <Card
            key={exercise.id}
            mode="contained"
            style={[
              styles.exerciseCard,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <Card.Content>
              {/* Exercise Header */}
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseNumberContainer}>
                  <Text
                    variant="titleMedium"
                    style={[
                      styles.exerciseNumber,
                      { color: theme.colors.primary },
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text
                    variant="titleMedium"
                    style={[
                      styles.exerciseName,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {exercise.name}
                  </Text>
                  <Chip
                    icon="trophy"
                    mode="flat"
                    compact
                    textStyle={{
                      color: theme.colors.secondary,
                      fontSize: 12,
                      includeFontPadding: false,
                    }}
                    style={[
                      styles.recordTypeChip,
                      { backgroundColor: theme.colors.secondaryContainer },
                    ]}
                  >
                    {exercise.recordType}
                  </Chip>
                </View>
              </View>

              <Divider
                style={{
                  backgroundColor: theme.colors.outline,
                  opacity: 0.2,
                  marginVertical: 12,
                }}
              />

              {/* Exercise Details */}
              <View style={styles.exerciseDetails}>
                {exercise.sets !== undefined && (
                  <View style={styles.detailItem}>
                    <Text
                      variant="labelMedium"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      Sets
                    </Text>
                    <Text
                      variant="bodyLarge"
                      style={[
                        styles.detailValue,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {exercise.sets}
                    </Text>
                  </View>
                )}

                {exercise.reps !== undefined && (
                  <View style={styles.detailItem}>
                    <Text
                      variant="labelMedium"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      Reps
                    </Text>
                    <Text
                      variant="bodyLarge"
                      style={[
                        styles.detailValue,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {exercise.reps}
                    </Text>
                  </View>
                )}

                {exercise.duration !== undefined && exercise.duration > 0 && (
                  <View style={styles.detailItem}>
                    <Text
                      variant="labelMedium"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      Duration
                    </Text>
                    <Text
                      variant="bodyLarge"
                      style={[
                        styles.detailValue,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {exercise.duration}s
                    </Text>
                  </View>
                )}

                {/* Muscle Groups */}
                <View style={styles.detailItem}>
                  <Text
                    variant="labelMedium"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    Muscles
                  </Text>
                  <View style={styles.muscleRow}>
                    <Chip
                      icon="arm-flex"
                      mode="flat"
                      compact
                      textStyle={[
                        styles.muscleChipText,
                        { color: theme.colors.primary },
                      ]}
                      style={[
                        styles.muscleChip,
                        { backgroundColor: theme.colors.primaryContainer },
                      ]}
                    >
                      {exercise.primaryMuscle}
                    </Chip>
                    {exercise.secondaryMuscle && (
                      <Chip
                        icon="arm-flex-outline"
                        mode="flat"
                        compact
                        textStyle={[
                          styles.muscleChipText,
                          { color: theme.colors.tertiary },
                        ]}
                        style={[
                          styles.muscleChip,
                          { backgroundColor: theme.colors.tertiaryContainer },
                        ]}
                      >
                        {exercise.secondaryMuscle}
                      </Chip>
                    )}
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSection: {
    marginBottom: 8,
    alignItems: "flex-start",
  },
  workoutTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    marginBottom: 12,
    lineHeight: 20,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  chip: {
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: "600",
  },
  exerciseCard: {
    borderRadius: 12,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  exerciseNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  exerciseNumber: {
    fontWeight: "bold",
  },
  exerciseInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  exerciseName: {
    fontWeight: "600",
    flex: 1,
  },
  recordTypeChip: {
    height: 28,
    justifyContent: "center",
  },
  muscleRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  muscleChip: {
    height: "auto",
    minHeight: 24,
    paddingVertical: 0,
    justifyContent: "center",
  },
  muscleChipText: {
    fontSize: 11,
    lineHeight: 14,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  exerciseDetails: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  detailItem: {
    flexDirection: "column",
    alignItems: "flex-start",
    minWidth: 60,
  },
  detailValue: {
    fontWeight: "600",
    marginTop: 4,
  },
  logsPlaceholder: {
    marginTop: 24,
    padding: 24,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 1,
    alignItems: "center",
  },
});

export default WorkoutDetailPage;
