import { SQLiteDatabase } from "expo-sqlite";
import { createExercisesTableQuery } from "./Exercises";

// export const db = await openDatabaseAsync("apecs");
const createExerciseLogsTableQuery = `
    CREATE TABLE IF NOT EXISTS ExerciseLogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exerciseId INTEGER,
        sets INTEGER,
        reps INTEGER,
        weight REAL,
        date TEXT,
        FOREIGN KEY (exerciseId) REFERENCES Exercises(id)
    )
    `;

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  console.log("Current DB version:", result?.user_version);
  let currentDbVersion = result?.user_version ?? 0;
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
        PRAGMA journal_mode = 'wal';
    `);
    await db.execAsync(createExercisesTableQuery);
    await db.execAsync(createExerciseLogsTableQuery);
    currentDbVersion = 1;
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
