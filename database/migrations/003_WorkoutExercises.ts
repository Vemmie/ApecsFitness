import { SQLiteDatabase } from "expo-sqlite";

export const version = 3; // Migration version

const tableName = "Workout_Exercises";

const createWorkoutExerciseTableQuery = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workoutId INTEGER NOT NULL,
        exerciseId INTEGER NOT NULL,
        orderIndex INTEGER,
        sets INTEGER DEFAULT 3,
        reps INTEGER DEFAULT 10,
        duration FLOAT DEFAULT 0,
        FOREIGN KEY (workoutId) REFERENCES Workouts(id) ON DELETE CASCADE,
        FOREIGN KEY (exerciseId) REFERENCES Exercises(id) ON DELETE CASCADE
    );
`;

export async function migrate(db: SQLiteDatabase) {
  await db.execAsync(createWorkoutExerciseTableQuery);
}
