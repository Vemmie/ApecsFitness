import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
        <ThemedView style={styles.contents}>
            <ScrollView >
                <ThemedText>Home Screen</ThemedText>
            </ScrollView>
        </ThemedView>
  );
}


const styles = StyleSheet.create({
  contents: { flexGrow: 1, padding: 32, paddingTop: 64 }
})
