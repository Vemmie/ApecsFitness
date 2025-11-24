// migrations/02_create_exercises.ts
import { SQLiteDatabase } from "expo-sqlite";

export const version = 1; // Migration version

const tableName = "Exercises";

export const createExercisesTableQuery = `
CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER DEFAULT 1,
    name TEXT NOT NULL,
    muscle TEXT,
    equipment TEXT,
    record_type TEXT,
    PRIMARY KEY(id)
);
`;

export async function migrate(db: SQLiteDatabase) {
  await db.execAsync(createExercisesTableQuery);
}
