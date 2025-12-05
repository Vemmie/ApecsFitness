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

type ExerciseRow = { record_type: string };

//
// ======================
//  TABLE CREATION QUERIES
// ======================
//

//
// ======================
//  INSERT / SELECT QUERIES
// ======================
//

export const insertWorkoutQuery = `
  INSERT INTO ${WorkoutsTable} (name, description)
  VALUES ($name, $description);
`;

export const insertWorkoutExerciseQuery = `
  INSERT INTO ${WorkoutExercisesTable} 
    (workoutId, exerciseId, orderIndex, sets, reps, duration)
  VALUES ($workoutId, $exerciseId, $orderIndex, $sets, $reps, $duration);
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

//
// ======================
//  MODEL FUNCTIONS
// ======================
//

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
