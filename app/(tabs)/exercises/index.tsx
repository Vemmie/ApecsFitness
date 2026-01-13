import FilterExerciseSelector from "@/components/exercises/FilterExercises/FilterExerciseSelector";
import ThemedAppHeader from "@/components/ThemedAppHeader";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { Exercise } from "@/database/models/exercise";

// Hooks
import {
  handleCreate,
  handleDeleteExercise,
  handleViewExercise,
  loadExercises,
} from "@/hooks/useExercises";

const Index = () => {
  // db and Theme
  const theme = useTheme();
  const db = useSQLiteContext();

  // States
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

  useFocusEffect(
    React.useCallback(() => {
      loadExercises(
        db,
        selectedMuscle,
        selectedEquipment,
        setExercises,
        setLoading,
      );
    }, [selectedMuscle, selectedEquipment]),
  );

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
          {exercises.map((item) => {
            // This for future debugging
            //console.log("Exercise Item:", item);
            return (
              <Swipeable
                key={item.id}
                renderRightActions={() => (
                  <TouchableOpacity
                    style={[
                      styles.deleteButton,
                      { backgroundColor: theme.colors.error },
                    ]}
                    onPress={() =>
                      handleDeleteExercise(
                        db,
                        item.name,
                        item.id!,
                        selectedMuscle,
                        selectedEquipment,
                        setExercises,
                        setLoading,
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.deleteText,
                        { color: theme.colors.onError },
                      ]}
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
                    {[
                      item.primary_muscle,
                      item.secondary_muscle,
                      item.equipment,
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                  </Text>
                </TouchableOpacity>
              </Swipeable>
            );
          })}
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
