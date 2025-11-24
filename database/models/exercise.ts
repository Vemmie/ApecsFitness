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

const updateExerciseQuery = `
  UPDATE ${tableName}
  SET name = $name,
      muscle = $muscle,
      equipment = $equipment,
      record_type = $recordType
  WHERE id = $id;
`;

const deleteExerciseQuery = `
  DELETE FROM ${tableName}
  WHERE id = $id
`;

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

export const updateExercise = async (
  db: SQLiteDatabase,
  exercise: Partial<Exercise> & { id: number },
) => {
  const fields: string[] = [];
  const params: Record<string, any> = { $id: exercise.id };

  if (exercise.name !== undefined) {
    fields.push("name = $name");
    params["$name"] = exercise.name;
  }

  if (exercise.muscle !== undefined) {
    fields.push("muscle = $muscle");
    params["$muscle"] = exercise.muscle;
  }

  if (exercise.equipment !== undefined) {
    fields.push("equipment = $equipment");
    params["$equipment"] = exercise.equipment;
  }

  if (exercise.recordType !== undefined) {
    fields.push("record_type = $recordType");
    params["$recordType"] = exercise.recordType;
  }

  // No updates → ignore
  if (fields.length === 0) return;

  const query = `
    UPDATE Exercises
    SET ${fields.join(", ")}
    WHERE id = $id
  `;

  const stmt = await db.prepareAsync(query);
  try {
    return await stmt.executeAsync(params);
  } finally {
    await stmt.finalizeAsync();
  }
};

export const deleteExercise = async (db: SQLiteDatabase, id: number) => {
  const stmt = await db.prepareAsync(deleteExerciseQuery);
  try {
    return await stmt.executeAsync({ $id: id });
  } finally {
    await stmt.finalizeAsync();
  }
};
