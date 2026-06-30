import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/expo";
import { router, useLocalSearchParams } from "expo-router";

export default function EditTodo() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getToken } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In production you should fetch the todo by id here.
    // For now the user can edit manually.
  }, []);

  const updateTodo = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await fetch(
        `http://192.168.29.177:3000/todos/updateTodo/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            completed,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      Alert.alert("Success", "Todo updated successfully");

      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.heading}>Edit Todo</Text>

        <Text style={styles.label}>Title</Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Todo title"
          placeholderTextColor="#64748B"
          style={styles.input}
        />

        <Text style={styles.label}>Description</Text>

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          placeholderTextColor="#64748B"
          multiline
          style={[styles.input, styles.description]}
        />

        <TouchableOpacity
          style={[
            styles.completeButton,
            completed && styles.completed,
          ]}
          onPress={() => setCompleted(!completed)}
        >
          <Text style={styles.completeText}>
            {completed
              ? "✓ Completed"
              : "Mark as Completed"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={updateTodo}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Update Todo
            </Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
  },

  heading: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 30,
  },

  label: {
    color: "#CBD5E1",
    marginBottom: 8,
    marginTop: 15,
    fontSize: 15,
  },

  input: {
    backgroundColor: "#1E293B",
    color: "#fff",
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
  },

  description: {
    height: 130,
    textAlignVertical: "top",
  },

  completeButton: {
    marginTop: 25,
    backgroundColor: "#334155",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
  },

  completed: {
    backgroundColor: "#22C55E",
  },

  completeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  button: {
    marginTop: 25,
    backgroundColor: "#2563EB",
    borderRadius: 15,
    padding: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
});
