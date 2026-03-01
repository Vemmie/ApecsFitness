// db/logs.ts
import { SQLiteDatabase } from "expo-sqlite";

export type ExerciseLog = {
  id: number;
  exerciseId: number;
  workoutExerciseId?: number | null;
  sets?: number | null;
  reps?: number | null;
  weight?: number | null;
  duration?: number | null;
  date?: string;
  workoutName?: string;
};

// Define a type specifically for creating NEW logs (Omit generated fields)
export type NewExerciseLog = Omit<ExerciseLog, "id" | "date" | "workoutName">;

// Find all workouts that include a specific exercise
export const fetchWorkoutsContainingExercise = async (
  db: SQLiteDatabase,
  exerciseId: number,
) => {
  const query = `
    SELECT 
      w.id as workoutId, 
      w.name as workoutName, 
      we.id as workoutExerciseId
    FROM Workouts w
    JOIN Workout_Exercises we ON w.id = we.workoutId
    WHERE we.exerciseId = $exerciseId
  `;
  return await db.getAllAsync<{
    workoutId: number;
    workoutName: string;
    workoutExerciseId: number;
  }>(query, { $exerciseId: exerciseId });
};

// Insert the new log
export const insertLog = async (db: SQLiteDatabase, log: NewExerciseLog) => {
  const query = `
    INSERT INTO Exercise_Logs (exerciseId, workoutExerciseId, sets, reps, weight, duration, date)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
  `;
  await db.runAsync(query, [
    log.exerciseId,
    log.workoutExerciseId ?? null,
    log.sets ?? null,
    log.reps ?? null,
    log.weight ?? null,
    log.duration ?? null,
  ]);
};

export type ExerciseLogWithDetails = ExerciseLog & {
  exercise_name: string;
  workout_name?: string | null;
};

// Fetch all logs with joined names for the list view
export const fetchAllLogsWithDetails = async (
  db: SQLiteDatabase,
): Promise<ExerciseLogWithDetails[]> => {
  const query = `
    SELECT 
      el.*,
      e.name AS exercise_name,
      w.name AS workout_name
    FROM Exercise_Logs el
    JOIN Exercises e ON el.exerciseId = e.id
    LEFT JOIN Workout_Exercises we ON el.workoutExerciseId = we.id
    LEFT JOIN Workouts w ON we.workoutId = w.id
    ORDER BY el.date DESC
  `;
  return await db.getAllAsync<ExerciseLogWithDetails>(query);
};

// Fetch a single log for editing
export const fetchLogById = async (
  db: SQLiteDatabase,
  id: number,
): Promise<ExerciseLog | null> => {
  const query = `SELECT * FROM Exercise_Logs WHERE id = ?`;
  return await db.getFirstAsync<ExerciseLog>(query, [id]);
};

// Delete a log
export const deleteLogById = async (db: SQLiteDatabase, id: number) => {
  await db.runAsync(`DELETE FROM Exercise_Logs WHERE id = ?`, [id]);
};

// Update a log
export const updateLog = async (
  db: SQLiteDatabase,
  id: number,
  updates: {
    sets: number | null;
    weight: number | null;
    reps: number | null;
    duration: number | null;
  },
) => {
  const query = `
    UPDATE Exercise_Logs 
    SET sets = ?, weight = ?, reps = ?, duration = ?
    WHERE id = ?
  `;
  await db.runAsync(query, [
    updates.sets,
    updates.weight,
    updates.reps,
    updates.duration,
    id,
  ]);
};

export const fetchLogsForExercise = async (
  db: SQLiteDatabase,
  exerciseId: number,
): Promise<ExerciseLog[]> => {
  try {
    // We join with Workouts to get the name of the routine, if applicable
    const query = `
      SELECT 
        el.*, 
        w.name as workoutName 
      FROM Exercise_Logs el
      LEFT JOIN Workout_Exercises we ON el.workoutExerciseId = we.id
      LEFT JOIN Workouts w ON we.workoutId = w.id
      WHERE el.exerciseId = ?
      ORDER BY el.date DESC
    `;

    const results = await db.getAllAsync<ExerciseLog>(query, [exerciseId]);
    return results;
  } catch (error) {
    console.error("Error fetching logs for exercise:", error);
    return [];
  }
};
