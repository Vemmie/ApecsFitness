// workoutModel.ts
import { SQLiteDatabase } from "expo-sqlite";

//
// ======================
//  SQL QUERIES (TOP)
// ======================
//

export const CREATE_WORKOUT_TABLE = `
  CREATE TABLE IF NOT EXISTS Workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
  );
`;

export const CREATE_WORKOUT_EXERCISE_TABLE = `
  CREATE TABLE IF NOT EXISTS Workout_Exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workoutId INTEGER NOT NULL,
    exerciseId INTEGER NOT NULL,
    orderIndex INTEGER,
    FOREIGN KEY (workoutId) REFERENCES Workouts(id) ON DELETE CASCADE,
    FOREIGN KEY (exerciseId) REFERENCES Exercises(id) ON DELETE CASCADE
  );
`;

export const INSERT_WORKOUT = `
  INSERT INTO Workouts (name, description)
  VALUES (?, ?);
`;

export const INSERT_WORKOUT_EXERCISE = `
  INSERT INTO Workout_Exercises (workoutId, exerciseId, orderIndex)
  VALUES (?, ?, ?);
`;

//
// ======================
//  LOGIC / FUNCTIONS (BOTTOM)
// ======================
//

export async function createWorkoutTable(db: SQLiteDatabase) {
  await db.execAsync(CREATE_WORKOUT_TABLE);
}

export async function createWorkoutExerciseTable(db: SQLiteDatabase) {
  await db.execAsync(CREATE_WORKOUT_EXERCISE_TABLE);
}

export async function createWorkoutWithExercises(
  db: SQLiteDatabase,
  name: string,
  description: string | null,
  exerciseIds: number[],
) {
  try {
    await db.execAsync("BEGIN TRANSACTION;");

    // Insert workout
    const result = await db.runAsync(INSERT_WORKOUT, [name, description]);
    const workoutId = result.lastInsertRowId;

    // Insert join table rows
    for (let i = 0; i < exerciseIds.length; i++) {
      await db.runAsync(INSERT_WORKOUT_EXERCISE, [
        workoutId,
        exerciseIds[i],
        i, // orderIndex
      ]);
    }

    await db.execAsync("COMMIT;");
    return workoutId;
  } catch (error) {
    console.error("Failed to create workout:", error);
    await db.execAsync("ROLLBACK;");
    throw error;
  }
}
