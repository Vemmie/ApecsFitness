import EquipmentEnum from "@/constants/EquipmentEnum";
import MuscleEnum from "@/constants/MuscleEnum";
import { SQLiteDatabase } from "react-native-sqlite-storage";

const tableName = "Exercises";

export const createExercisesTableQuery = `
CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER DEFAULT 1,
    muscle TEXT,
    equipment TEXT,
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

export const addExercise = async (db: SQLiteDatabase, exercise: Exercise) => {
  const insertQuery = `
     INSERT INTO ${tableName} (name, muscle, equipment, recordType)
     VALUES (?, ?, ?, ?)
   `;
  const values = [
    exercise.name,
    exercise.muscle,
    exercise.equipment,
    exercise.recordType,
  ];
  try {
    return db.executeSql(insertQuery, values);
  } catch (error) {
    console.error(error);
    throw Error("Failed to add exercise");
  }
};

export const getExercises = async (db: SQLiteDatabase): Promise<Exercise[]> => {
  try {
    const exercises: Exercise[] = [];
    const results = await db.executeSql(`SELECT * FROM ${tableName}`);
    results?.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        exercises.push(result.rows.item(index));
      }
    });
    return exercises;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get Exercises from database");
  }
};
