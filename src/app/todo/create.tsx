import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
const SetTodo = () => {
  const { getToken } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const createTodo = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Please enter a title.");
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();


      const response = await fetch(
        "http://192.168.29.177:3000/todos/setTodo",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      router.push("/todo");

      setTitle("");
      setDescription("");
    } catch (error: any) {
      Alert.alert("Error", error.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.heading}>Create Todo</Text>

      <Text style={styles.subtitle}>
        Add a new task and stay productive.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Title</Text>

        <TextInput
          placeholder="Enter todo title"
          placeholderTextColor="#64748B"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>

        <TextInput
          placeholder="Write something..."
          placeholderTextColor="#64748B"
          style={[styles.input, styles.description]}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={createTodo}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Create Todo
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SetTodo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingHorizontal: 22,
    justifyContent: "center",
  },

  heading: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 16,
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 20,
  },

  label: {
    color: "#CBD5E1",
    fontSize: 15,
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    backgroundColor: "#334155",
    color: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },

  description: {
    height: 130,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#2563EB",
    marginTop: 28,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});