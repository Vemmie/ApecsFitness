import { useFocusEffect } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

import ThemedAppHeader from "@/components/ThemedAppHeader";
import {
  deleteLogById,
  ExerciseLogWithDetails,
  fetchAllLogsWithDetails,
} from "@/database/models/log";

export default function ViewLogsScreen() {
  const theme = useTheme();
  const db = useSQLiteContext();
  const router = useRouter();

  const [logs, setLogs] = useState<ExerciseLogWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllLogsWithDetails(db);
      setLogs(data);
    } catch (error) {
      console.error("Error loading logs:", error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadLogs();
    }, [loadLogs]),
  );

  const confirmDelete = (id: number) => {
    Alert.alert("Delete Log", "Are you sure you want to delete this log?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteLogById(db, id);
          loadLogs();
        },
      },
    ]);
  };

  const renderRightActions = (id: number) => (
    <View style={styles.actionRow}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
        onPress={() => router.push(`/logs/${id}/edit`)}
      >
        <Text
          style={{ color: theme.colors.onPrimaryContainer, fontWeight: "600" }}
        >
          Edit
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
        onPress={() => confirmDelete(id)}
      >
        <Text style={{ color: theme.colors.onError, fontWeight: "600" }}>
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ThemedAppHeader
          title="Activity Logs"
          showBackButton
          onBackPress={() => router.back()}
        />

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.container}>
            {logs.length === 0 ? (
              <Text style={styles.emptyText}>
                No logs found. Time to hit the gym!
              </Text>
            ) : (
              logs.map((item) => (
                <Swipeable
                  key={item.id}
                  renderRightActions={() => renderRightActions(item.id!)}
                  friction={2}
                  rightThreshold={40}
                >
                  <View
                    style={[
                      styles.logItem,
                      {
                        backgroundColor: theme.colors.surface,
                        borderBottomColor: theme.colors.outlineVariant,
                      },
                    ]}
                  >
                    <View style={styles.logInfo}>
                      <Text variant="titleMedium">{item.exercise_name}</Text>
                      <Text
                        variant="bodySmall"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        {item.sets ? `${item.sets} sets x ` : ""}
                        {item.weight ? `${item.weight} lbs x ` : ""}
                        {item.reps ? `${item.reps} reps` : ""}
                        {item.duration ? `${item.duration}s` : ""}
                      </Text>
                      {item.workout_name && (
                        <Text
                          variant="labelSmall"
                          style={{ color: theme.colors.primary, marginTop: 4 }}
                        >
                          Linked: {item.workout_name}
                        </Text>
                      )}
                    </View>
                    <Text variant="labelSmall" style={styles.dateText}>
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : ""}
                    </Text>
                  </View>
                </Swipeable>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { paddingBottom: 32 },
  emptyText: { textAlign: "center", marginTop: 40, opacity: 0.6 },
  logItem: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  logInfo: { flex: 1 },
  dateText: { opacity: 0.5, marginLeft: 8 },
  actionRow: { flexDirection: "row", width: 160 },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});
