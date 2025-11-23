import EquipmentEnum from "@/constants/EquipmentEnum";
import MuscleEnum from "@/constants/MuscleEnum";
import { SQLiteDatabase } from "expo-sqlite";

const tableName = "Exercises";

export const createExercisesTableQuery = `
CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER DEFAULT 1,
    name TEXT NOT NULL,
    muscle TEXT,
    equipment TEXT,
    record_type TEXT,
    PRIMARY KEY(id)
)
`;

type Exercise = {
  id?: number; // Optional for inserts
  name: string;
  muscle: MuscleEnum;
  equipment: EquipmentEnum;
  recordType: string; // e.g., "weight", "time", "distance"
};

export const insertExerciseQuery = `
    INSERT INTO ${tableName} (name, muscle, equipment, record_type)
    VALUES ($name, $muscle, $equipment, $recordType)`;

export const selectAllExercisesQuery = `
    SELECT * FROM ${tableName}`;

export const insertExercise = async (
  db: SQLiteDatabase,
  exercise: Exercise,
) => {
  const { name, muscle, equipment, recordType } = exercise;
  try {
    const insertStatment = await db.prepareAsync(insertExerciseQuery);
    let result;
    try {
      result = await insertStatment.executeAsync({
        $name: name,
        $muscle: muscle,
        $equipment: equipment,
        $recordType: recordType,
      });
    } catch (e) {
      console.error("Error inserting exercise:", e);
    } finally {
      await insertStatment.finalizeAsync();
    }

    return result;
  } catch (e) {
    console.error("Error preparing insert statement:", e);
  }
};

export const fetchAllExercises = async (db: SQLiteDatabase) => {
  const selectStatement = await db.prepareAsync(selectAllExercisesQuery);
  let result;
  try {
    result = await selectStatement.executeAsync();
  } catch (e) {
    console.error("Error fetching exercises:", e);
  } finally {
    await selectStatement.finalizeAsync();
  }
  return result;
};
