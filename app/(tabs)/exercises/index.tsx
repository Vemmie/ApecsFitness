import FilterExerciseSelector from "@/components/exercises/FilterExercises/FilterExerciseSelector";
import ThemedAppHeader from "@/components/ThemedAppHeader";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { List, useTheme } from "react-native-paper";

import EquipmentEnum from "@/constants/EquipmentEnum";
import MuscleEnum from "@/constants/MuscleEnum";
import {
  deleteExercise,
  Exercise,
  fetchExercisesFiltered,
} from "@/database/models/exercise";

const Index = () => {
  const router = useRouter();
  const theme = useTheme();
  const db = useSQLiteContext();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedMuscle, setSelectedMuscles] = useState<
    MuscleEnum | undefined
  >();
  const [selectedEquipment, setSelectedEquipment] = useState<
    EquipmentEnum | undefined
  >();

  // Accordion state
  const [filtersOpen, setFiltersOpen] = useState(false);

  const loadExercises = async () => {
    try {
      setLoading(true);

      let data: Exercise[];
      if (selectedMuscle || selectedEquipment) {
        // If any filter is selected, pass them
        data = await fetchExercisesFiltered(
          db,
          selectedMuscle,
          selectedEquipment,
        );
      } else {
        // No filters selected, fetch all
        data = await fetchExercisesFiltered(db);
      }

      setExercises(data);
    } catch (error) {
      console.error("Failed to load exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadExercises();
    }, [selectedMuscle, selectedEquipment]),
  );

  const handleDelete = async (id: number, name: string) => {
    Alert.alert(
      "Delete Exercise",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteExercise(db, id);
              await loadExercises();
            } catch (error) {
              console.error("Error deleting exercise:", error);
              Alert.alert("Error", "Failed to delete exercise");
            }
          },
        },
      ],
    );
  };

  const handleViewExercise = (id: number) => {
    router.push({
      pathname: "/(tabs)/exercises/[id]",
      params: { id },
    });
  };

  const handleCreate = () =>
    router.navigate("/(tabs)/exercises/createExercise");

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <ThemedAppHeader
        title="Exercises"
        rightIcon="plus"
        rightIconOnPress={handleCreate}
      />

      {/* Filters Accordion */}
      <List.Section>
        <List.Accordion
          title="Filters"
          expanded={filtersOpen}
          onPress={() => setFiltersOpen(!filtersOpen)}
          left={(props) => <List.Icon {...props} icon="filter" />}
        >
          <FilterExerciseSelector
            selectedMuscle={selectedMuscle}
            setSelectedMuscle={setSelectedMuscles}
            equipment={selectedEquipment}
            setEquipment={setSelectedEquipment}
          />
        </List.Accordion>
      </List.Section>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : exercises.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: theme.colors.onSurface }}>
            No exercises found
          </Text>
          <Text
            style={{
              marginTop: 8,
              opacity: 0.6,
              color: theme.colors.onSurface,
            }}
          >
            Tap + to create one
          </Text>
        </View>
      ) : (
        <ScrollView>
          {exercises.map((item) => (
            <Swipeable
              key={item.id}
              renderRightActions={() => (
                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    { backgroundColor: theme.colors.error },
                  ]}
                  onPress={() => handleDelete(item.id!, item.name)}
                >
                  <Text
                    style={[styles.deleteText, { color: theme.colors.onError }]}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              )}
            >
              <TouchableOpacity
                style={[
                  styles.exerciseItem,
                  {
                    borderBottomColor: theme.colors.outline,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
                onPress={() => handleViewExercise(item.id!)}
              >
                <Text
                  style={[
                    styles.exerciseName,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.exerciseDetails,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {item.muscle} • {item.equipment}
                </Text>
              </TouchableOpacity>
            </Swipeable>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  exerciseItem: { padding: 16, borderBottomWidth: 1 },
  exerciseName: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  exerciseDetails: { fontSize: 14, opacity: 0.7 },
  deleteButton: { justifyContent: "center", alignItems: "center", width: 80 },
  deleteText: { fontWeight: "600" },
});

export default Index;
