// db/exercises.ts
import EquipmentEnum from "@/constants/EquipmentEnum";
import MuscleEnum from "@/constants/MuscleEnum";
import { SQLiteDatabase } from "expo-sqlite";

const tableName = "Exercises";

export type Exercise = {
  id?: number;
  name: string;
  primary_muscle: MuscleEnum;
  secondary_muscle: MuscleEnum;
  equipment: EquipmentEnum;
  record_type: string; // "weight", "time", etc.
};

// Queries
const insertExerciseQuery = `
  INSERT INTO ${tableName} (name, primary_muscle, secondary_muscle, equipment, record_type)
  VALUES ($name, $primary_muscle, $secondary_muscle, $equipment, $recordType)
`;

function selectExercisesFilteredQuery(
  muscle?: MuscleEnum,
  equipment?: EquipmentEnum,
) {
  let query = `SELECT * FROM ${tableName}`;
  const params: Record<string, any> = {};
  const conditions: string[] = [];

  if (muscle != null && muscle !== MuscleEnum.NONE) {
    conditions.push(`(primary_muscle = $muscle OR secondary_muscle = $muscle)`);
    params["$muscle"] = muscle;
  }

  if (equipment != null && equipment !== EquipmentEnum.NONE) {
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
      primary_muscle = $primary_muscle,
      secondary_muscle = $secondary_muscle,
      equipment = $equipment,
      record_type = $recordType
  WHERE id = $id;
`;

const getExerciseByIdQuery = `
  SELECT *
  FROM ${tableName}
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
  const { name, primary_muscle, secondary_muscle, equipment, record_type } =
    exercise;

  const stmt = await db.prepareAsync(insertExerciseQuery);
  try {
    return await stmt.executeAsync({
      $name: name,
      $primary_muscle: primary_muscle,
      $secondary_muscle:
        secondary_muscle === MuscleEnum.NONE ? null : secondary_muscle,
      $equipment: equipment,
      $record_type: record_type,
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
  try {
    // Always pass a params object
    const result = await db.getAllAsync(query, params ?? {});
    return result as Exercise[];
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }
};

export const fetchtExerciseById = async (db: SQLiteDatabase, id: number) => {
  try {
    const result = await db.getFirstAsync(getExerciseByIdQuery, { $id: id });
    return result as Exercise;
  } catch (error) {
    console.error("Error fetching exercise by ID:", error);
    throw error;
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

  if (exercise.primary_muscle !== undefined) {
    fields.push("primary_muscle = $primary_muscle");
    params["$primary_muscle"] = exercise.primary_muscle;
  }

  if (exercise.secondary_muscle !== undefined) {
    fields.push("secondary_muscle = $secondary_muscle");
    params["$secondary_muscle"] =
      exercise.secondary_muscle === MuscleEnum.NONE ||
      !exercise.secondary_muscle
        ? null
        : exercise.secondary_muscle;
  }

  if (exercise.equipment !== undefined) {
    fields.push("equipment = $equipment");
    params["$equipment"] = exercise.equipment;
  }

  if (exercise.record_type !== undefined) {
    fields.push("record_type = $recordType");
    params["$recordType"] = exercise.record_type;
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
