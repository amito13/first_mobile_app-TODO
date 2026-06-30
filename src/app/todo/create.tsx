import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../../theme/colors";
import { RADIUS } from "../../../theme/radius";
import { SHADOW } from "../../../theme/shadows";
import { SPACING } from "../../../theme/spacing";
import { FONT } from "../../../theme/typography";

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

      const response = await fetch(process.env.EXPO_PUBLIC_CREATE_TODO_URL!, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

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
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              <Text style={styles.kicker}>Create task</Text>
              <Text style={styles.heading}>Add a new todo</Text>
              <Text style={styles.subtitle}>
                Capture the work now so it stays visible and actionable.
              </Text>

              <View style={styles.progressRow}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>01</Text>
                  <Text style={styles.metricLabel}>Step</Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>Fast</Text>
                  <Text style={styles.metricLabel}>Create</Text>
                </View>
              </View>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                placeholder="Enter todo title"
                placeholderTextColor={COLORS.subText}
                style={styles.input}
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                placeholder="Write something..."
                placeholderTextColor={COLORS.subText}
                style={[styles.input, styles.description]}
                multiline
                value={description}
                onChangeText={setDescription}
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={styles.button}
                onPress={createTodo}
                disabled={loading}
                activeOpacity={0.9}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.buttonText}>Create Todo</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.back()}
                activeOpacity={0.85}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SetTodo;

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

  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW,
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

  kicker: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: FONT.bold,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: SPACING.xs,
  },

  progressRow: {
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
    fontSize: 13,
    fontFamily: FONT.semiBold,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
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

  button: {
    backgroundColor: COLORS.primary,
    marginTop: SPACING.lg,
    borderRadius: RADIUS.round,
    paddingVertical: SPACING.md,
    alignItems: "center",
    ...SHADOW,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONT.semiBold,
  },

  secondaryButton: {
    marginTop: SPACING.sm,
    borderRadius: RADIUS.round,
    paddingVertical: SPACING.md,
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  secondaryButtonText: {
    color: COLORS.text,
    fontFamily: FONT.semiBold,
  },
});
