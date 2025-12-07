import { SQLiteDatabase } from "expo-sqlite";

export const version = 4; // Whatever version this migration represents

const tableName = "Exercise_Logs";

const createExerciseLogsTableQuery = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exerciseId INTEGER NOT NULL,
    workoutExerciseId INTEGER,               
    sets INTEGER,
    reps INTEGER,
    weight FLOAT,
    duration FLOAT,
    date TEXT,
    FOREIGN KEY (exerciseId) REFERENCES Exercises(id) ON DELETE CASCADE,
    FOREIGN KEY (workoutExerciseId) REFERENCES Workout_Exercises(id) ON DELETE SET NULL
  );
`;

export async function migrate(db: SQLiteDatabase) {
  await db.execAsync(createExerciseLogsTableQuery);
}
