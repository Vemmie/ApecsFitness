import MuscleEnum from "@/constants/MuscleEnum";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import MuscleChip from "./MuscleChip";

type Props = {
  selectedMuscle: MuscleEnum | undefined;
  setSelectedMuscle: (muscle: MuscleEnum | undefined) => void;
};

const MuscleSelector = ({ selectedMuscle, setSelectedMuscle }: Props) => {
  const theme = useTheme();

  const handlePress = (muscle: MuscleEnum) => {
    if (selectedMuscle === muscle) {
      setSelectedMuscle(undefined);
    } else {
      setSelectedMuscle(muscle);
    }
  };

  return (
    <View style={[styles.contents]}>
      <View
        style={{
          flexDirection: "row",
          flexGrow: 1,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {Object.values(MuscleEnum)
          .filter((item) => item !== MuscleEnum.NONE)
          .map((muscle) => (
            <MuscleChip
              key={muscle}
              style={styles.chip}
              muscle={muscle}
              isSelected={selectedMuscle === muscle}
              onPress={handlePress}
            />
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contents: { gap: 8 },
  chip: {
    width: "45%",
    flexGrow: 1,
  },
});
export default MuscleSelector;
