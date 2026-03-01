// db/workouts.ts
import RecordType from "@/constants/RecordType";
import { SQLiteDatabase } from "expo-sqlite";

const WorkoutsTable = "Workouts";
const WorkoutExercisesTable = "Workout_Exercises";
const ExercisesTable = "Exercises";

export type Workout = {
  id?: number;
  name: string;
  description?: string | null;
};

export type WorkoutExerciseInput = {
  exerciseId: number;
  sets?: number;
  reps?: number;
  duration?: number;
};

export type WorkoutExercise = {
  id?: number;
  workoutId: number;
  exerciseId: number;
  orderIndex?: number;
  sets?: number | null;
  reps?: number | null;
  duration?: number | null;
};

export type WorkoutWithExercises = {
  id: number;
  name: string;
  description: string | null;
  exercises: {
    id: number;
    exerciseId: number;
    name: string;
    orderIndex: number;
    sets?: number;
    reps?: number;
    duration?: number;
    recordType: RecordType;
    primaryMuscle: string;
    secondaryMuscle: string;
  }[];
};

export type WorkoutExerciseInfoRow = {
  workoutId: number;
  workoutName: string;
  workoutDescription: string | null;

  workoutExerciseId: number;
  orderIndex: number;
  sets: number | null;
  reps: number | null;
  duration: number | null;

  exerciseId: number;
  exerciseName: string;
  primaryMuscle: string;
  secondaryMuscle: string;
  recordType: string;
};

type ExerciseRow = { record_type: string };

// ======================
// QUERIES
// ======================

export const insertWorkoutQuery = `
  INSERT INTO ${WorkoutsTable} (name, description)
  VALUES ($name, $description);
`;

export const insertWorkoutExerciseQuery = `
  INSERT INTO ${WorkoutExercisesTable} 
    (workoutId, exerciseId, orderIndex, sets, reps, duration)
  VALUES ($workoutId, $exerciseId, $orderIndex, $sets, $reps, $duration);
`;

export const getWorkouts = `
  SELECT * FROM ${WorkoutsTable};
`;

export const getWorkoutByIdQuery = `
  SELECT * FROM ${WorkoutsTable} WHERE id = $id;
`;

export const getWorkoutExercisesQuery = `
  SELECT * FROM ${WorkoutExercisesTable} WHERE workoutId = $workoutId;
`;

export const getExerciseRecordTypeQuery = `
  SELECT record_type FROM ${ExercisesTable} WHERE id = $id;
`;

export const deleteWorkoutQuery = `
  DELETE FROM ${WorkoutsTable} WHERE id = $id;
`;

export const getWorkoutExerciseInfo = `
  SELECT
    w.id               AS workoutId,
    w.name             AS workoutName,
    w.description      AS workoutDescription,

    we.id              AS workoutExerciseId,
    we.orderIndex,
    we.sets,
    we.reps,
    we.duration,

    e.id               AS exerciseId,
    e.name             AS exerciseName,
    e.primary_muscle   AS primaryMuscle,
    e.secondary_muscle AS secondaryMuscle,
    e.record_type      AS recordType

  FROM ${WorkoutsTable} w
  JOIN ${WorkoutExercisesTable} we
    ON we.workoutId = w.id
  JOIN ${ExercisesTable} e
    ON e.id = we.exerciseId

  ORDER BY w.id, we.orderIndex;
`;

// ======================
// Model Functions
// ======================

export const insertWorkout = async (db: SQLiteDatabase, workout: Workout) => {
  const stmt = await db.prepareAsync(insertWorkoutQuery);
  try {
    const result = await stmt.executeAsync({
      $name: workout.name,
      $description: workout.description ?? null,
    });
    return result.lastInsertRowId;
  } finally {
    await stmt.finalizeAsync();
  }
};

export const insertWorkoutExercise = async (
  db: SQLiteDatabase,
  workoutId: number,
  exercise: WorkoutExerciseInput,
  orderIndex: number,
) => {
  // Get exercise record_type
  const exerciseRow = await db.getFirstAsync<ExerciseRow>(
    getExerciseRecordTypeQuery,
    {
      $id: exercise.exerciseId,
    },
  );

  if (!exerciseRow)
    throw new Error(`Exercise with ID ${exercise.exerciseId} not found`);

  let sets: number | null = 3;
  let reps: number | null = 10;
  let duration: number | null = 0;

  switch (exerciseRow.record_type as RecordType) {
    case RecordType.WEIGHT_AND_REPS:
      sets = exercise.sets ?? 3;
      reps = exercise.reps ?? 10;
      duration = 0;
      break;
    case RecordType.REPS:
      sets = exercise.sets ?? 3;
      reps = exercise.reps ?? 10;
      duration = 0;
      break;
    case RecordType.TIME:
      sets = null;
      reps = null;
      duration = exercise.duration ?? 30;
      break;
  }

  const stmt = await db.prepareAsync(insertWorkoutExerciseQuery);
  try {
    await stmt.executeAsync({
      $workoutId: workoutId,
      $exerciseId: exercise.exerciseId,
      $orderIndex: orderIndex,
      $sets: sets,
      $reps: reps,
      $duration: duration,
    });
  } finally {
    await stmt.finalizeAsync();
  }
};

export const fetchWorkouts = async (db: SQLiteDatabase): Promise<Workout[]> => {
  const stmt = await db.prepareAsync(getWorkouts);
  try {
    const result = await stmt.executeAsync();
    return (await result.getAllAsync()) as Workout[];
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return [];
  } finally {
    await stmt.finalizeAsync();
  }
};

const mapWorkoutExerciseInfo = (
  rows: WorkoutExerciseInfoRow[],
): WorkoutWithExercises[] => {
  const map = new Map<number, WorkoutWithExercises>();

  for (const row of rows) {
    if (!map.has(row.workoutId)) {
      map.set(row.workoutId, {
        id: row.workoutId,
        name: row.workoutName,
        description: row.workoutDescription,
        exercises: [],
      });
    }

    map.get(row.workoutId)!.exercises.push({
      id: row.workoutExerciseId,
      exerciseId: row.exerciseId,
      name: row.exerciseName,
      orderIndex: row.orderIndex,
      sets: row.sets ?? undefined,
      reps: row.reps ?? undefined,
      duration: row.duration ?? undefined,
      recordType: row.recordType as RecordType,
      primaryMuscle: row.primaryMuscle,
      secondaryMuscle: row.secondaryMuscle,
    });
  }

  return Array.from(map.values());
};

export const fetchWorkoutsWithExercises = async (
  db: SQLiteDatabase,
): Promise<WorkoutWithExercises[]> => {
  try {
    const rows = await db.getAllAsync<WorkoutExerciseInfoRow>(
      getWorkoutExerciseInfo,
    );

    return mapWorkoutExerciseInfo(rows);
  } catch (error) {
    console.error("Error fetching workouts with exercises:", error);
    return [];
  }
};

export const deleteWorkout = async (db: SQLiteDatabase, id: number) => {
  await db.execAsync("PRAGMA foreign_keys = ON;");

  const stmt = await db.prepareAsync(deleteWorkoutQuery);
  try {
    const result = await stmt.executeAsync({ $id: id });
    return result;
  } catch (error) {
    console.error(`Error deleting workout with ID ${id}:`, error);
    throw error;
  } finally {
    await stmt.finalizeAsync();
  }
};

export const updateWorkout = async (
  db: SQLiteDatabase,
  workoutId: number,
  data: { name: string; description: string; exercises: any[] },
) => {
  // Start a transaction
  await db.withTransactionAsync(async () => {
    // 1. Update the main workout record
    await db.runAsync(
      `UPDATE Workouts SET name = ?, description = ? WHERE id = ?`,
      [data.name, data.description, workoutId],
    );

    // 2. Remove all existing exercises for this workout
    await db.runAsync(`DELETE FROM Workout_Exercises WHERE workoutId = ?`, [
      workoutId,
    ]);

    // 3. Re-insert the updated list of exercises
    for (let i = 0; i < data.exercises.length; i++) {
      const ex = data.exercises[i];
      // Note: Reusing your logic for record types (simplified here)
      const sets = ex.record_type === RecordType.TIME ? null : ex.sets || 3;
      const reps = ex.record_type === RecordType.TIME ? null : ex.reps || 10;
      const duration =
        ex.record_type === RecordType.TIME ? ex.duration || 30 : 0;

      await db.runAsync(
        `INSERT INTO Workout_Exercises (workoutId, exerciseId, orderIndex, sets, reps, duration)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [workoutId, ex.exerciseId, i, sets, reps, duration],
      );
    }
  });
};

// Helper to fetch a single workout with its joined exercises
export const fetchWorkoutById = async (
  db: SQLiteDatabase,
  id: number,
): Promise<WorkoutWithExercises | null> => {
  const rows = await db.getAllAsync<WorkoutExerciseInfoRow>(
    `${getWorkoutExerciseInfo.replace("ORDER BY", "WHERE w.id = ? ORDER BY")}`,
    [id],
  );

  if (rows.length === 0) return null;
  const workouts = mapWorkoutExerciseInfo(rows);
  return workouts[0];
};
