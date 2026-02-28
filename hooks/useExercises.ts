import EquipmentEnum from "@/constants/EquipmentEnum";
import MuscleEnum from "@/constants/MuscleEnum";
import {
  deleteExercise,
  Exercise,
  fetchExercisesFiltered,
} from "@/database/models/exercise";

// Db and Router
import { useRouter } from "expo-router";
import { SQLiteDatabase } from "expo-sqlite";

// UI imports
import { Alert } from "react-native";

const router = useRouter();

export const loadExercises = async (
  db: SQLiteDatabase,
  muscle: MuscleEnum | undefined,
  equipment: EquipmentEnum | undefined,
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    setLoading(true);

    const data = await fetchExercisesFiltered(db, muscle, equipment);

    setExercises(data);
  } catch (error) {
    console.error("Failed to load exercises:", error);
  } finally {
    setLoading(false);
  }
};

export const handleDeleteExercise = async (
  db: SQLiteDatabase,
  name: string,
  id: number,
  muscle: MuscleEnum | undefined,
  equipment: EquipmentEnum | undefined,
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  Alert.alert("Delete Exercise", `Are you sure you want to delete "${name}"?`, [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        try {
          await deleteExercise(db, id);
          await loadExercises(db, muscle, equipment, setExercises, setLoading);
        } catch (error) {
          console.error("Error deleting exercise:", error);
          Alert.alert("Error", "Failed to delete exercise");
        }
      },
    },
  ]);
};

export const handleCreate = () =>
  router.navigate("/(tabs)/exercises/createExercise");

export const handleEdit = (id: number) => {
  router.push({
    pathname: "/(tabs)/exercises/[id]/editExercise",
    params: { id },
  });
};

export const handleViewExercise = (id: number) => {
  router.push({
    pathname: "/(tabs)/exercises/[id]",
    params: { id },
  });
};
