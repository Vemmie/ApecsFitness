import ThemedAppHeader from "@/components/ThemedAppHeader";
import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

const FitnessChat = () => {
  const theme = useTheme();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

const sendMessage = async () => {
    if (!input.trim()) return;

    // Use timestamp for unique user message ID
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://10.0.2.2:8080/get-coaching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.text();
      // Use unique ID for AI response
      const aiMsg: Message = { id: (Date.now() + 1).toString(), text: data, sender: "ai" };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      
      // FIX: Use a unique ID for the error message so React doesn't complain
      const errorMsg: Message = { 
        id: `error-${Date.now()}`, 
        text: "Could not connect to the Apecs AI service. Is your Go server running?", 
        sender: "ai" 
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      // Optional: Add a small delay to ensure the list has rendered before scrolling
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageWrapper,
        item.sender === "user" ? styles.userWrapper : styles.aiWrapper,
      ]}
    >
      <Card
        style={[
          styles.messageCard,
          {
            backgroundColor:
              item.sender === "user"
                ? theme.colors.primary
                : theme.colors.surfaceVariant,
          },
        ]}
      >
        <Card.Content>
          <Text
            style={{
              color: item.sender === "user" ? "white" : theme.colors.onSurfaceVariant,
            }}
          >
            {item.text}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.colors.surface }}
    >
      <ThemedAppHeader
        title="Apecs AI Coach"
        showBackButton
        onBackPress={() => router.back()}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text variant="bodyLarge" style={{ opacity: 0.6 }}>
              Ask your coach for advice or motivation!
            </Text>
          </View>
        }
      />

      {loading && <ActivityIndicator style={{ marginBottom: 8 }} />}

      <View style={[styles.inputContainer, { backgroundColor: theme.colors.elevation.level2 }]}>
        <TextInput
          mode="flat"
          placeholder="Type your question..."
          value={input}
          onChangeText={setInput}
          style={styles.textInput}
          activeUnderlineColor="transparent"
          underlineColor="transparent"
        />
        <IconButton
          icon="send"
          mode="contained"
          containerColor={theme.colors.primary}
          iconColor="white"
          onPress={sendMessage}
          disabled={loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  chatContainer: { padding: 16, paddingBottom: 32 },
  messageWrapper: { marginVertical: 4, maxWidth: "80%" },
  userWrapper: { alignSelf: "flex-end" },
  aiWrapper: { alignSelf: "flex-start" },
  messageCard: { borderRadius: 16 },
  emptyState: { flex: 1, alignItems: "center", marginTop: 100 },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  textInput: { flex: 1, backgroundColor: "transparent", height: 45 },
});

export default FitnessChat;