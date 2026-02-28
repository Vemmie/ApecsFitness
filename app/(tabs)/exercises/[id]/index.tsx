import ThemedAppHeader from "@/components/ThemedAppHeader";
import { fetchtExerciseById } from "@/database/models/exercise";
import { handleEdit } from "@/hooks/useExercises";
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

const ExerciseDetailPage = () => {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const db = useSQLiteContext();

  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const goBack = () => router.back();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await fetchtExerciseById(db, Number(id));
        setExercise(data);
      } catch (error) {
        console.error("Error fetching exercise details:", error);
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

  if (!exercise) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.surface }]}
      >
        <Text style={{ color: theme.colors.error }}>Exercise not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <ThemedAppHeader
        title="Exercise Details"
        showBackButton={true}
        onBackPress={goBack}
        rightIcon="pencil"
        rightIconOnPress={() => handleEdit(Number(id))}
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
            <Chip
              icon="arm-flex"
              mode="flat"
              textStyle={{ color: theme.colors.primary }}
              style={[
                styles.chip,
                { backgroundColor: theme.colors.secondaryContainer },
              ]}
            >
              {exercise.primary_muscle}
            </Chip>
            <Chip
              icon="dumbbell"
              mode="flat"
              textStyle={{ color: theme.colors.primary }}
              style={[
                styles.chip,
                { backgroundColor: theme.colors.secondaryContainer },
              ]}
            >
              {exercise.equipment}
            </Chip>
          </View>
        </View>

        <Divider
          style={{
            backgroundColor: theme.colors.outlineVariant,
            marginVertical: 16,
          }}
        />

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

            <Divider
              style={{
                backgroundColor: theme.colors.outline,
                opacity: 0.2,
                marginVertical: 8,
              }}
            />

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

        {/* History Placeholder */}
        <View
          style={[
            styles.logsPlaceholder,
            {
              borderColor: theme.colors.outlineVariant,
              backgroundColor: theme.colors.elevation.level1,
            },
          ]}
        >
          <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
            History & Logs
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}
          >
            Log history will appear here in a future update.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSection: {
    marginBottom: 20,
    alignItems: "flex-start",
  },
  exerciseTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderRadius: 8,
  },
  card: {
    borderRadius: 12,
  },
  cardContent: {
    paddingVertical: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  logsPlaceholder: {
    marginTop: 32,
    padding: 24,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 1,
    alignItems: "center",
  },
});

export default ExerciseDetailPage;
