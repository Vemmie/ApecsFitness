import { SQLiteDatabase } from "expo-sqlite";

export const version = 1; // Migration version

const tableName = "Exercises";

// Add pictures column to Exercises table later
// Have a local file with image URIs mapped to exercise IDs

const createExercisesTableQuery = `
CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    primary_muscle TEXT,
    secondary_muscle TEXT,
    equipment TEXT,
    record_type TEXT
);
`;

export async function migrate(db: SQLiteDatabase) {
  await db.execAsync(createExercisesTableQuery);
}
