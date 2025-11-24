import { SQLiteDatabase } from "expo-sqlite";
import { migrationsList } from "./migrations/migrationList";

// export const db = await openDatabaseAsync("apecs");

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  // Reset version for testing
  /*
  let currVersion = 0;
  console.debug("Reset DB to version 0");
 */

  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );

  let currVersion = result?.user_version ?? 0;

  //let currVersion = result?.user_version ?? 0;
  console.debug("Current DB version:", currVersion);

  for (const migration of migrationsList) {
    if (currVersion < migration.version) {
      console.debug(`Applying migration version ${migration.version}...`);
      await migration.migrate(db);
      currVersion = migration.version;
    }
  }
  // Update DB version after each migration
  await db.execAsync(`PRAGMA user_version = ${currVersion}`);
}
