import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useSQLiteContext } from "expo-sqlite";

/**
 * Component to initialize Drizzle Studio in development.
 * It must be a child component of SQLiteProvider to access the DB context.
 */
export default function DrizzleStudioSetup() {
  // 1. Access the raw Expo SQLite DB object from the context
  const db = useSQLiteContext();

  // 2. Only run the setup hook in a development environment
  // to avoid shipping it in production bundles.
  if (__DEV__) {
    // 3. Pass the raw DB object to the Drizzle Studio hook
    useDrizzleStudio(db);
  }

  // This component doesn't need to render anything
  return null;
}
