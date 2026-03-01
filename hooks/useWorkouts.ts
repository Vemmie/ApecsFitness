import { deleteWorkout } from "@/database/models/workout";
import { router } from "expo-router"; // Use the singleton router export for utility files
import { SQLiteDatabase } from "expo-sqlite";
import { Alert } from "react-native";

/**
 * Navigates to the Create Workout page
 */
export const handleCreateWorkout = () => {
  router.push("/(tabs)/workouts/createWorkout");
};

/**
 * Navigates to the Edit Workout page
 */
export const handleEditWorkout = (id: number) => {
  router.push({
    pathname: "/(tabs)/workouts/[id]/editWorkout",
    params: { id: id.toString() },
  });
};

/**
 * Navigates to the Workout Details page
 */
export const handleViewWorkout = (id: number) => {
  router.push({
    pathname: "/(tabs)/workouts/[id]",
    params: { id: id.toString() },
  });
};

/**
 * Handles the deletion of a workout with a confirmation alert.
 * @param onComplete Optional callback to refresh a list or update state after deletion
 */
export const handleDeleteWorkout = (
  db: SQLiteDatabase,
  id: number,
  name: string,
  onComplete?: () => void,
) => {
  Alert.alert(
    "Delete Workout",
    `Are you sure you want to delete "${name}"? This will remove all associated exercise settings.`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteWorkout(db, id);

            if (onComplete) {
              onComplete();
            } else {
              // If no refresh callback is provided, we usually want to head back
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(tabs)/workouts");
              }
            }
          } catch (error) {
            console.error("Error deleting workout:", error);
            Alert.alert("Error", "Failed to delete workout");
          }
        },
      },
    ],
  );
};
