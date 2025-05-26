import React from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView, StyleSheet } from 'react-native';
const exercises = () => {
    return (
        <ThemedView style={styles.contents}>
            <ScrollView >
                <ThemedText>Exercises Screen</ThemedText>
            </ScrollView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    contents: { flexGrow: 1, padding: 32, paddingTop: 64 }
})

export default exercises