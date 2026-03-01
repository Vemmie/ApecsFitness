import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import {
  ActivityIndicator,
  Card,
  Chip,
  Divider,
  Text,
  useTheme,
} from "react-native-paper";

import ThemedAppHeader from "@/components/ThemedAppHeader";
import { fetchtExerciseById } from "@/database/models/exercise";
import {
  deleteLogById,
  ExerciseLog,
  fetchLogsForExercise,
} from "@/database/models/log";
import { handleEdit as handleExerciseEdit } from "@/hooks/useExercises";

const ExerciseDetailPage = () => {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const db = useSQLiteContext();

  const [exercise, setExercise] = useState<any>(null);
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const exerciseId = Number(id);
      const [exerciseData, logsData] = await Promise.all([
        fetchtExerciseById(db, exerciseId),
        fetchLogsForExercise(db, exerciseId),
      ]);
      setExercise(exerciseData);
      setLogs(logsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [id, db]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const confirmDelete = (logId: number) => {
    Alert.alert("Delete Log", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteLogById(db, logId);
          loadData();
        },
      },
    ]);
  };

  const renderRightActions = (logId: number) => (
    <View style={styles.actionRow}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
        onPress={() => router.push(`/logs/${logId}/edit`)}
      >
        <Text
          style={{ color: theme.colors.onPrimaryContainer, fontWeight: "600" }}
        >
          Edit
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: theme.colors.errorContainer },
        ]}
        onPress={() => confirmDelete(logId)}
      >
        <Text
          style={{ color: theme.colors.onErrorContainer, fontWeight: "600" }}
        >
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  if (!exercise)
    return (
      <View style={styles.centered}>
        <Text>Exercise not found.</Text>
      </View>
    );

  const isTimeBased = exercise.record_type?.toLowerCase().includes("time");

  // Helper to filter out "Other", "None", or empty strings properly
  const shouldShowMuscle = (muscle: string) => {
    if (!muscle) return false;
    const normalized = muscle.trim().toLowerCase();
    return normalized !== "" && normalized !== "other" && normalized !== "none";
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ThemedAppHeader
          title="Exercise Details"
          showBackButton
          onBackPress={() => router.back()}
          rightIcon="pencil"
          rightIconOnPress={() => handleExerciseEdit(Number(id))}
        />

        <ScrollView contentContainerStyle={styles.container}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text
              variant="headlineMedium"
              style={[styles.exerciseTitle, { color: theme.colors.onSurface }]}
            >
              {exercise.name}
            </Text>
            <View style={styles.chipRow}>
              {shouldShowMuscle(exercise.primary_muscle) && (
                <Chip icon="arm-flex" mode="flat" style={styles.headerChip}>
                  {exercise.primary_muscle}
                </Chip>
              )}
              {shouldShowMuscle(exercise.secondary_muscle) && (
                <Chip
                  icon="arm-flex-outline"
                  mode="flat"
                  style={styles.headerChip}
                >
                  {exercise.secondary_muscle}
                </Chip>
              )}
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Info Card */}
          <Card
            mode="contained"
            style={[
              styles.card,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <Card.Content style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text
                  variant="labelLarge"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Secondary Muscle
                </Text>
                <Text
                  variant="bodyLarge"
                  style={{ color: theme.colors.onSurface }}
                >
                  {exercise.secondary_muscle || "None"}
                </Text>
              </View>
              <Divider style={styles.innerDivider} />
              <View style={styles.infoRow}>
                <Text
                  variant="labelLarge"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Equipment
                </Text>
                <Text
                  variant="bodyLarge"
                  style={{ color: theme.colors.onSurface }}
                >
                  {exercise.equipment || "None"}
                </Text>
              </View>
              <Divider style={styles.innerDivider} />
              <View style={styles.infoRow}>
                <Text
                  variant="labelLarge"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Record Type
                </Text>
                <Text
                  variant="bodyLarge"
                  style={{ color: theme.colors.onSurface }}
                >
                  {exercise.record_type}
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Text variant="titleLarge" style={styles.historyTitle}>
            History & Logs
          </Text>

          {logs.length === 0 ? (
            <View style={styles.emptyLogs}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                No logs yet.
              </Text>
            </View>
          ) : (
            logs.map((log) => (
              <Swipeable
                key={log.id}
                renderRightActions={() => renderRightActions(log.id!)}
                friction={2}
                rightThreshold={40}
              >
                <Card style={styles.logCard} mode="outlined">
                  <Card.Content style={styles.logContent}>
                    {/* Left side: Stats and Date */}
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text variant="titleMedium" style={{ fontWeight: "600" }}>
                        {isTimeBased
                          ? `${log.duration}s`
                          : `${log.weight || 0} lbs x ${log.reps || 0} reps`}
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{ opacity: 0.6, marginTop: 2 }}
                      >
                        {new Date(log.date!).toLocaleDateString()}
                      </Text>
                    </View>

                    {/* Right side: Workout Name (Fixed layout to prevent cutoff) */}
                    {log.workoutName && (
                      <View style={styles.workoutChipContainer}>
                        <Chip
                          compact
                          textStyle={styles.workoutChipText}
                          style={styles.workoutChip}
                        >
                          {log.workoutName}
                        </Chip>
                      </View>
                    )}
                  </Card.Content>
                </Card>
              </Swipeable>
            ))
          )}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerSection: { marginBottom: 8 },
  exerciseTitle: { fontWeight: "bold", marginBottom: 12 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  headerChip: { borderRadius: 8 },
  divider: { marginVertical: 16, opacity: 0.5 },
  card: { borderRadius: 12 },
  cardContent: { paddingVertical: 8 },
  innerDivider: { opacity: 0.2, marginVertical: 8 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  historyTitle: { marginTop: 24, marginBottom: 16, fontWeight: "bold" },
  logCard: {
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  logContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  workoutChipContainer: {
    marginLeft: 8,
    maxWidth: "40%",
    alignItems: "flex-end",
  },
  workoutChip: {
    height: "auto",
    minHeight: 24,
    borderRadius: 8,
    paddingVertical: 0,
  },
  workoutChipText: {
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center",
  },
  emptyLogs: {
    padding: 24,
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    borderRadius: 12,
  },
  actionRow: {
    flexDirection: "row",
    width: 160,
    marginBottom: 8,
    marginLeft: 8,
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginLeft: 8,
  },
});

export default ExerciseDetailPage;
