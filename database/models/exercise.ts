// db/exercises.ts
import EquipmentEnum from "@/constants/EquipmentEnum";
import MuscleEnum from "@/constants/MuscleEnum";
import { SQLiteDatabase } from "expo-sqlite";

const tableName = "Exercises";

export type Exercise = {
  id?: number;
  name: string;
  muscle: MuscleEnum;
  equipment: EquipmentEnum;
  recordType: string; // "weight", "time", etc.
};

// Queries
const insertExerciseQuery = `
  INSERT INTO ${tableName} (name, muscle, equipment, record_type)
  VALUES ($name, $muscle, $equipment, $recordType)
`;

function selectExercisesFilteredQuery(
  muscle?: MuscleEnum,
  equipment?: EquipmentEnum,
) {
  let query = `SELECT * FROM ${tableName}`;
  const params: Record<string, any> = {};
  const conditions: string[] = [];

  if (muscle) {
    conditions.push(`muscle = $muscle`);
    params["$muscle"] = muscle;
  }

  if (equipment) {
    conditions.push(`equipment = $equipment`);
    params["$equipment"] = equipment;
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  return { query, params };
}

// Model functions
export const insertExercise = async (
  db: SQLiteDatabase,
  exercise: Exercise,
) => {
  const { name, muscle, equipment, recordType } = exercise;

  const stmt = await db.prepareAsync(insertExerciseQuery);
  try {
    return await stmt.executeAsync({
      $name: name,
      $muscle: muscle,
      $equipment: equipment,
      $recordType: recordType,
    });
  } finally {
    await stmt.finalizeAsync();
  }
};

export const fetchExercisesFiltered = async (
  db: SQLiteDatabase,
  muscle?: MuscleEnum,
  equipment?: EquipmentEnum,
) => {
  const { query, params } = selectExercisesFilteredQuery(muscle, equipment);

  const stmt = await db.prepareAsync(query);
  try {
    return await stmt.executeAsync(params);
  } finally {
    await stmt.finalizeAsync();
  }
};
