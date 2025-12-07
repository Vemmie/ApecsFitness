import { SQLiteDatabase } from "expo-sqlite";

export const version = 2; // Migration version

const tableName = "Workouts";

const createWorkoutTableQuery = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
    );
`;

export async function migrate(db: SQLiteDatabase) {
  await db.execAsync(createWorkoutTableQuery);
}
