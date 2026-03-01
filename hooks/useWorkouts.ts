import { deleteWorkout } from "@/database/models/workout"; // adjust path as needed
import { useRouter } from "expo-router";
import { SQLiteDatabase } from "expo-sqlite";
import { Alert } from "react-native";

export const handleDeleteWorkout = (db: SQLiteDatabase, id: number) => {
  const router = useRouter();
  Alert.alert(
    "Delete Workout",
    "Are you sure? This will remove the workout and all its exercise settings.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteWorkout(db, id);
            router.replace("/workouts"); // Redirect to list after delete
          } catch (error) {
            // Handle error (e.g., show a snackbar)
          }
        },
      },
    ],
  );
};
