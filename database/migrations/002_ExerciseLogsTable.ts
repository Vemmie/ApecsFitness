import { SQLiteDatabase } from "expo-sqlite";

export const version = 2; // Whatever version this migration represents

const tableName = "ExerciseLogs";

const createExerciseLogsTableQuery = `
  CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exerciseId INTEGER,
      sets INTEGER,
      reps INTEGER,
      weight REAL,
      date TEXT,
      FOREIGN KEY (exerciseId) REFERENCES Exercises(id)
  );
`;

export async function migrate(db: SQLiteDatabase) {
  await db.execAsync(createExerciseLogsTableQuery);
}
