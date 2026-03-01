import ThemedAppHeader from "@/components/ThemedAppHeader";
import { fetchWorkouts } from "@/database/models/workout";
import { handleDeleteWorkout } from "@/hooks/useWorkouts";
import { useFocusEffect, useRouter } from "expo-router";
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
  const router = useRouter();

  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Define the fetcher logic once
  const fetchData = useCallback(async () => {
    // Only show the big spinner if we don't have data yet
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

  // Using Focus Effect because you add it doesn't rerender new list
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const handleCreate = () => {
    router.push("/workouts/createWorkout");
  };

  const handleEdit = (id: number) => {
    router.push(`/workouts/edit/${id}`);
  };

  const handleView = (id: number) => {
    router.push({
      pathname: "/(tabs)/workouts/[id]",
      params: { id },
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await handleDeleteWorkout(db, id);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
        <ThemedAppHeader
          title="Workouts"
          rightIcon="plus"
          rightIconOnPress={handleCreate}
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
                      onPress={() => handleEdit(workout.id)}
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
                      onPress={() => handleDelete(workout.id)}
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
                  onPress={() => handleView(workout.id)}
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 8,
    bottom: 80,
    borderRadius: 30,
  },
});

export default ViewWorkouts;
