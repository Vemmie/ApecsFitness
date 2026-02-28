import FilterExerciseSelector from "@/components/exercises/FilterExercises/FilterExerciseSelector";
import ThemedAppHeader from "@/components/ThemedAppHeader";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useIsFocused } from "@react-navigation/native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Button, FAB, Portal, useTheme } from "react-native-paper";

import EquipmentEnum from "@/constants/EquipmentEnum";
import MuscleEnum from "@/constants/MuscleEnum";
import { Exercise } from "@/database/models/exercise";

import {
  handleCreate,
  handleDeleteExercise,
  handleViewExercise,
  loadExercises,
} from "@/hooks/useExercises";

const Index = () => {
  const theme = useTheme();
  const db = useSQLiteContext();
  const router = useRouter();
  const isFocused = useIsFocused();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMuscle, setSelectedMuscles] = useState<
    MuscleEnum | undefined
  >();
  const [selectedEquipment, setSelectedEquipment] = useState<
    EquipmentEnum | undefined
  >();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "90%"], []);

  // Calculate how many filters are currently active
  const activeFilterCount = [selectedMuscle, selectedEquipment].filter(
    Boolean,
  ).length;

  const handleOpenFilters = () => bottomSheetRef.current?.expand();
  const handleCloseFilters = () => bottomSheetRef.current?.close();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSheetChange = useCallback((index: number) => {
    // index -1 means closed, 0 or 1 means open
    setIsSheetOpen(index >= 0);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  useFocusEffect(
    React.useCallback(() => {
      loadExercises(
        db,
        selectedMuscle,
        selectedEquipment,
        setExercises,
        setLoading,
      );
    }, [selectedMuscle, selectedEquipment, db]),
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
        <ThemedAppHeader
          title="Exercises"
          rightIcon="plus"
          rightIconOnPress={handleCreate}
        />

        {/* 1. TOP FILTER STATUS BAR */}
        <View
          style={[
            styles.filterStatus,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <Text
            style={{
              color: theme.colors.onSurfaceVariant,
              fontWeight: "600",
              flex: 1,
            }}
          >
            {activeFilterCount > 0
              ? `Filtered by: ${[selectedMuscle, selectedEquipment]
                  .filter(Boolean)
                  .join(" • ")}`
              : "Showing all exercises"}
          </Text>
          {activeFilterCount > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSelectedMuscles(undefined);
                setSelectedEquipment(undefined);
              }}
            >
              <Text
                style={{
                  color: theme.colors.primary,
                  fontWeight: "bold",
                  marginLeft: 8,
                }}
              >
                Clear
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
            {exercises.map((item) => (
              <Swipeable
                key={item.id}
                renderRightActions={() => (
                  <View style={{ flexDirection: "row" }}>
                    {/* EDIT BUTTON */}
                    <TouchableOpacity
                      style={[
                        styles.editButton,
                        { backgroundColor: theme.colors.primaryContainer },
                      ]}
                      onPress={() => router.push(`/exercises/edit/${item.id}`)}
                    >
                      <Text
                        style={[
                          styles.actionText,
                          { color: theme.colors.onPrimaryContainer },
                        ]}
                      >
                        Edit
                      </Text>
                    </TouchableOpacity>

                    {/* DELETE BUTTON */}
                    <TouchableOpacity
                      style={[
                        styles.deleteButton,
                        { backgroundColor: theme.colors.error },
                      ]}
                      onPress={() =>
                        handleDeleteExercise(
                          db,
                          item.name,
                          item.id!,
                          selectedMuscle,
                          selectedEquipment,
                          setExercises,
                          setLoading,
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.actionText,
                          { color: theme.colors.onError },
                        ]}
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              >
                <TouchableOpacity
                  style={[
                    styles.exerciseItem,
                    {
                      borderBottomColor: theme.colors.outline,
                      backgroundColor: theme.colors.surface,
                    },
                  ]}
                  onPress={() => handleViewExercise(item.id!)}
                >
                  <Text
                    style={[
                      styles.exerciseName,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.exerciseDetails,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {[
                      item.primary_muscle,
                      item.secondary_muscle,
                      item.equipment,
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                  </Text>
                </TouchableOpacity>
              </Swipeable>
            ))}
          </ScrollView>
        )}

        {/* 2. POSITIONED FLOATING FILTER BUBBLE */}
        <Portal>
          {/* Logic: Hide FAB if the bottom sheet is open (isSheetOpen === true) */}
          {isFocused && !isSheetOpen && (
            <FAB
              icon="filter"
              onPress={handleOpenFilters}
              style={[
                styles.fab,
                {
                  backgroundColor:
                    activeFilterCount > 0
                      ? theme.colors.primary
                      : theme.colors.elevation.level5,
                },
              ]}
              color={
                activeFilterCount > 0
                  ? theme.colors.onPrimary
                  : theme.colors.primary
              }
            />
          )}
        </Portal>

        {/* 3. BOTTOM SHEET */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          // Add the onChange listener to toggle FAB visibility
          onChange={handleSheetChange}
          backgroundStyle={{ backgroundColor: theme.colors.elevation.level3 }}
          handleIndicatorStyle={{
            backgroundColor: theme.colors.onSurfaceVariant,
          }}
        >
          <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
            <Text
              style={[styles.sheetTitle, { color: theme.colors.onSurface }]}
            >
              Filters
            </Text>

            <FilterExerciseSelector
              selectedMuscle={selectedMuscle}
              setSelectedMuscle={setSelectedMuscles}
              equipment={selectedEquipment}
              setEquipment={setSelectedEquipment}
            />

            <View style={styles.sheetActions}>
              <Button
                mode="outlined"
                onPress={() => {
                  setSelectedMuscles(undefined);
                  setSelectedEquipment(undefined);
                }}
                style={{ flex: 1 }}
              >
                Clear
              </Button>
              <Button
                mode="contained"
                onPress={handleCloseFilters}
                style={{ flex: 2 }}
              >
                Apply
              </Button>
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  filterStatus: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  exerciseItem: { padding: 16, borderBottomWidth: 1 },
  exerciseName: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  exerciseDetails: { fontSize: 14, opacity: 0.7 },
  editButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  actionText: { fontWeight: "600" },
  fab: {
    position: "absolute",
    margin: 16,
    right: 8,
    // Sitting above the tab bar (adjust if your tabs are taller/shorter)
    bottom: 80,
    borderRadius: 30,
  },
  sheetContent: {
    padding: 24,
    gap: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  sheetActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    paddingBottom: 20,
  },
});

export default Index;
