import { useAuth } from "@clerk/expo";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../../../theme/colors";
import { RADIUS } from "../../../../theme/radius";
import { SHADOW } from "../../../../theme/shadows";
import { SPACING } from "../../../../theme/spacing";
import { FONT } from "../../../../theme/typography";

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
      const apiUrl = process.env.EXPO_PUBLIC_UPDATE_TODO_URL! + `/${id}`;
      const response = await fetch(apiUrl!, {
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
      });

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
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.backdropTop} />
          <View style={styles.backdropBottom} />

          <View style={styles.heroCard}>
            <Text style={styles.kicker}>Edit task</Text>
            <Text style={styles.heading}>Update todo</Text>
            <Text style={styles.subtitle}>
              Refine the details and keep the task moving forward.
            </Text>

            <View style={styles.metricRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>
                  {completed ? "Yes" : "No"}
                </Text>
                <Text style={styles.metricLabel}>Completed</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>Live</Text>
                <Text style={styles.metricLabel}>Update</Text>
              </View>
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Todo title"
              placeholderTextColor={COLORS.subText}
              style={styles.input}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
              placeholderTextColor={COLORS.subText}
              multiline
              textAlignVertical="top"
              style={[styles.input, styles.description]}
            />

            <TouchableOpacity
              style={[styles.completeButton, completed && styles.completed]}
              activeOpacity={0.85}
              onPress={() => setCompleted(!completed)}
            >
              <Text style={styles.completeText}>
                {completed ? "✓ Completed" : "Mark as Completed"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={updateTodo}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Update Todo</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.85}
              onPress={() => router.back()}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },

  backdropTop: {
    position: "absolute",
    top: -110,
    right: -90,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(178, 58, 42, 0.12)",
  },

  backdropBottom: {
    position: "absolute",
    bottom: 110,
    left: -90,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(200, 90, 68, 0.1)",
  },

  kicker: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: FONT.bold,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: SPACING.xs,
  },

  heading: {
    color: COLORS.text,
    fontSize: 30,
    fontFamily: FONT.heading,
  },

  subtitle: {
    color: COLORS.subText,
    fontSize: 14,
    lineHeight: 21,
    marginTop: SPACING.xs,
    fontFamily: FONT.body,
  },

  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW,
  },

  metricRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },

  metricCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },

  metricValue: {
    color: COLORS.primary,
    fontSize: 24,
    fontFamily: FONT.bold,
  },

  metricLabel: {
    color: COLORS.subText,
    marginTop: 4,
    fontFamily: FONT.medium,
  },

  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW,
  },

  label: {
    color: COLORS.text,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
    fontSize: 13,
    fontFamily: FONT.semiBold,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  input: {
    backgroundColor: COLORS.background,
    color: COLORS.text,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontFamily: FONT.medium,
  },

  description: {
    height: 130,
    marginTop: 0,
  },

  completeButton: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.round,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  completed: {
    backgroundColor: "rgba(46, 139, 87, 0.14)",
    borderColor: COLORS.success,
  },

  completeText: {
    color: COLORS.text,
    fontFamily: FONT.semiBold,
    fontSize: 16,
  },

  button: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.round,
    paddingVertical: SPACING.md,
    alignItems: "center",
    ...SHADOW,
  },

  buttonText: {
    color: COLORS.white,
    fontFamily: FONT.semiBold,
    fontSize: 16,
  },

  secondaryButton: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.round,
    paddingVertical: SPACING.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  secondaryButtonText: {
    color: COLORS.text,
    fontFamily: FONT.semiBold,
  },
});
