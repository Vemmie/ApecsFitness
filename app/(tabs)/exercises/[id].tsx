import ThemedAppHeader from "@/components/ThemedAppHeader";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

const ExerciseDetailPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const goBack = () => router.navigate("..");
  return (
    <View style={{ backgroundColor: theme.colors.surface, flexShrink: 1 }}>
      <ThemedAppHeader
        title="Exercise Details" // The title for this screen
        showBackButton={true} // Show the back button
        onBackPress={goBack} // Pass the specific back action
        rightIcon="pencil"
      />
    </View>
  );
};

export default ExerciseDetailPage;
