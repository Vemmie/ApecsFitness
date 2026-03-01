import ThemedAppHeader from "@/components/ThemedAppHeader";
import { fetchWorkouts } from "@/database/models/workout";
// Import your utilities (ensure the path matches where you saved the previous snippet)
import {
  handleCreateWorkout,
  handleDeleteWorkout,
  handleEditWorkout,
  handleViewWorkout,
} from "@/hooks/useWorkouts";

import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useTheme } from "react-native-paper";

const ViewWorkouts = () => {
  const theme = useTheme();
  const db = useSQLiteContext();

  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetcher logic
  const fetchData = useCallback(async () => {
    if (workouts.length === 0) setLoading(true);
    try {
      const results = await fetchWorkouts(db);
      setWorkouts(results);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  }, [db, workouts.length]);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  // Wrapper for delete to handle the local state update
  const onDeleteComplete = (id: number) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
        <ThemedAppHeader
          title="Workouts"
          rightIcon="plus"
          rightIconOnPress={handleCreateWorkout}
        />

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
            {workouts.map((workout) => (
              <Swipeable
                key={workout.id}
                renderRightActions={() => (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={[
                        styles.editButton,
                        { backgroundColor: theme.colors.primaryContainer },
                      ]}
                      onPress={() => handleEditWorkout(workout.id)}
                    >
                      <Text
                        style={[
                          styles.actionText,
                          { color: theme.colors.onPrimaryContainer },
                        ]}
                      >
                        Edit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.deleteButton,
                        { backgroundColor: theme.colors.error },
                      ]}
                      onPress={() =>
                        handleDeleteWorkout(db, workout.id, workout.name, () =>
                          onDeleteComplete(workout.id),
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.actionText,
                          { color: theme.colors.onError },
                        ]}
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              >
                <TouchableOpacity
                  style={[
                    styles.workoutItem,
                    { borderBottomColor: theme.colors.outline },
                  ]}
                  onPress={() => handleViewWorkout(workout.id)}
                >
                  <Text
                    style={[
                      styles.workoutName,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {workout.name}
                  </Text>
                  {workout.description && (
                    <Text
                      style={[
                        styles.workoutDescription,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {workout.description}
                    </Text>
                  )}
                </TouchableOpacity>
              </Swipeable>
            ))}
          </ScrollView>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  workoutItem: { padding: 16, borderBottomWidth: 1 },
  workoutName: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  workoutDescription: { fontSize: 14, opacity: 0.7 },
  editButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  actionText: { fontWeight: "600" },
});

export default ViewWorkouts;
