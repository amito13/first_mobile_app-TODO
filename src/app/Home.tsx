import { useAuth, useUser } from "@clerk/expo";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";
import { COLORS } from "../../theme/colors";
import { RADIUS } from "../../theme/radius";
import { SHADOW } from "../../theme/shadows";
import { SPACING } from "../../theme/spacing";
import { FONT } from "../../theme/typography";

const quickActions = [
  {
    emoji: "➕",
    title: "Create New Task",
    subtitle: "Capture a goal before it slips away.",
    onPress: () => router.push("/todo/create"),
  },
  {
    emoji: "📋",
    title: "View Tasks",
    subtitle: "Scan your list and keep momentum.",
    onPress: () => router.push("/todo"),
  },
  // {
  //   emoji: "📊",
  //   title: "Review Progress",
  //   subtitle: "Check what moved forward today.",
  //   onPress: undefined,
  // },
];

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const Home = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);

  const firstName = user?.firstName ?? user?.fullName?.split(" ")[0] ?? "User";
  const initial = firstName.charAt(0).toUpperCase();
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const loadTodos = useCallback(async () => {
    try {
      const token = await getToken();
      const apiUrl = process.env.EXPO_PUBLIC_GET_TODO_URL!;
      const response = await fetch(
        apiUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      setTodos(data.todos ?? data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const completedCount = todos.filter((todo) => todo.completed).length;
  const pendingCount = todos.length - completedCount;
  const recentTodos = todos.slice(0, 3);

  const metrics = useMemo(
    () => [
      { label: "Tasks", value: String(todos.length) },
      { label: "Completed", value: String(completedCount) },
      { label: "Pending", value: String(pendingCount) },
    ],
    [completedCount, pendingCount, todos.length],
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadTodos();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.backdropTop} />
        <View style={styles.backdropBottom} />

        <View style={styles.header}>
          {/* <TouchableOpacity
            style={styles.avatarButton}
            activeOpacity={0.85}
            onPress={() => setProfileVisible(true)}
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.profilePill}
            activeOpacity={0.85}
            onPress={() => setProfileVisible(true)}
          >
            <Text style={styles.profilePillLabel}>Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.kicker}>Today</Text>
          <Text style={styles.heroTitle}>Hello, {firstName}</Text>
          <Text style={styles.heroSubtitle}>{todayLabel}</Text>
          <Text style={styles.heroBody}>
            Keep the work visible, move quickly, and finish one meaningful thing
            at a time.
          </Text>

          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading tasks...</Text>
            </View>
          ) : (
            <View style={styles.metricRow}>
              {metrics.map((metric) => (
                <View key={metric.label} style={styles.metricCard}>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionHint}>
            Tap to move without extra steps
          </Text>
        </View>

        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.title}
            style={styles.actionCard}
            activeOpacity={0.9}
            onPress={action.onPress}
            disabled={!action.onPress}
          >
            <View style={styles.actionIconWrap}>
              <Text style={styles.actionEmoji}>{action.emoji}</Text>
            </View>

            <View style={styles.actionTextWrap}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </View>

            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Tasks</Text>
          <Text style={styles.sectionHint}> Some task that actually matters</Text>
        </View>

        {recentTodos.length === 0 ? (
          <View style={styles.focusCard}>
            <Text style={styles.focusTitle}>No tasks yet</Text>
            <Text style={styles.focusSubtitle}>
              Create a task to see your live progress here.
            </Text>
          </View>
        ) : (
          recentTodos.map((todo) => (
            <View key={todo.id} style={styles.focusCard}>
              <View style={styles.todoRow}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: todo.completed
                        ? COLORS.success
                        : COLORS.primary,
                    },
                  ]}
                />
                <View style={styles.todoCopy}>
                  <Text style={styles.focusTitle}>{todo.title}</Text>
                  <Text style={styles.focusSubtitle}>
                    {todo.description || "No description"}
                  </Text>
                </View>
              </View>

              <View style={styles.todoFooter}>
                <Text style={styles.todoStatus}>
                  {todo.completed ? "Completed" : "Pending"}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: "/todo/edit/[id]",
                      params: { id: todo.id },
                    })
                  }
                >
                  <Text style={styles.todoLink}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <Modal
          visible={profileVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setProfileVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setProfileVisible(false)}
          >
            <View
              style={styles.profileCard}
              onStartShouldSetResponder={() => true}
            >
              <View style={styles.profileTopRow}>
                {user?.imageUrl ? (
                  <Image
                    source={{ uri: user.imageUrl }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profileFallback}>
                    <Text style={styles.profileFallbackText}>{initial}</Text>
                  </View>
                )}

                <View style={styles.profileCopy}>
                  <Text style={styles.profileName}>
                    {user?.fullName ?? "Your profile"}
                  </Text>
                  <Text style={styles.profileEmail}>
                    {user?.primaryEmailAddress?.emailAddress ??
                      "No email linked"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoGrid}>
                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>User ID</Text>
                  <Text style={styles.infoText}>{user?.id ?? "-"}</Text>
                </View>

                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>Username</Text>
                  <Text style={styles.infoText}>
                    {user?.username ?? "Not set"}
                  </Text>
                </View>

                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>Phone</Text>
                  <Text style={styles.infoText}>
                    {user?.primaryPhoneNumber?.phoneNumber ?? "Not available"}
                  </Text>
                </View>

                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>Created At</Text>
                  <Text style={styles.infoText}>
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </Text>
                </View>
              </View>

              <View style={styles.profileActions}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  activeOpacity={0.85}
                  onPress={() => setProfileVisible(false)}
                >
                  <Text style={styles.secondaryButtonText}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryButton}
                  activeOpacity={0.85}
                  onPress={async () => {
                    try {
                      await signOut();
                      setProfileVisible(false);
                      router.replace("/");
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  <Text style={styles.primaryButtonText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },

  backdropTop: {
    position: "absolute",
    top: -120,
    right: -100,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(178, 58, 42, 0.12)",
  },

  backdropBottom: {
    position: "absolute",
    bottom: 100,
    left: -90,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(200, 90, 68, 0.1)",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  avatarButton: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW,
  },

  avatarText: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: FONT.bold,
  },

  profilePill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  profilePillLabel: {
    color: COLORS.primary,
    fontFamily: FONT.semiBold,
  },

  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW,
  },

  kicker: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: FONT.bold,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: SPACING.xs,
  },

  heroTitle: {
    color: COLORS.text,
    fontSize: 30,
    fontFamily: FONT.heading,
  },

  heroSubtitle: {
    color: COLORS.subText,
    marginTop: SPACING.xs,
    fontSize: 14,
    fontFamily: FONT.medium,
  },

  heroBody: {
    color: COLORS.text,
    marginTop: SPACING.md,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: FONT.body,
  },

  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontSize: 26,
    fontFamily: FONT.bold,
  },

  metricLabel: {
    color: COLORS.subText,
    marginTop: 4,
    fontFamily: FONT.medium,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontFamily: FONT.bold,
  },

  sectionHint: {
    color: COLORS.subText,
    fontSize: 12,
    fontFamily: FONT.medium,
  },

  actionCard: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW,
  },

  actionIconWrap: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },

  actionEmoji: {
    fontSize: 24,
  },

  actionTextWrap: {
    flex: 1,
  },

  actionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontFamily: FONT.semiBold,
  },

  actionSubtitle: {
    color: COLORS.subText,
    marginTop: 4,
    fontFamily: FONT.body,
  },

  actionChevron: {
    color: COLORS.primary,
    fontSize: 28,
    marginLeft: SPACING.sm,
    marginTop: -2,
  },

  focusCard: {
    backgroundColor: "rgba(255, 248, 240, 0.88)",
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  focusTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONT.semiBold,
    marginBottom: SPACING.xs,
  },

  focusSubtitle: {
    color: COLORS.subText,
    lineHeight: 21,
    fontFamily: FONT.body,
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },

  loadingText: {
    color: COLORS.subText,
    fontFamily: FONT.medium,
  },

  todoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },

  todoCopy: {
    flex: 1,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 7,
  },

  todoFooter: {
    marginTop: SPACING.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  todoStatus: {
    color: COLORS.subText,
    fontFamily: FONT.medium,
  },

  todoLink: {
    color: COLORS.primary,
    fontFamily: FONT.semiBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.66)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
  },

  profileCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW,
  },

  profileTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },

  profileImage: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.round,
  },

  profileFallback: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  profileFallbackText: {
    color: COLORS.white,
    fontSize: 28,
    fontFamily: FONT.bold,
  },

  profileCopy: {
    flex: 1,
  },

  profileName: {
    color: COLORS.text,
    fontSize: 22,
    fontFamily: FONT.bold,
  },

  profileEmail: {
    color: COLORS.subText,
    marginTop: 4,
    fontFamily: FONT.body,
  },

  infoGrid: {
    gap: SPACING.sm,
  },

  infoBox: {
    width: "100%",
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  infoTitle: {
    color: COLORS.subText,
    fontSize: 12,
    fontFamily: FONT.semiBold,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  infoText: {
    color: COLORS.text,
    fontSize: 15,
    marginTop: 6,
    fontFamily: FONT.medium,
  },

  profileActions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },

  secondaryButton: {
    flex: 1,
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

  primaryButton: {
    flex: 1,
    borderRadius: RADIUS.round,
    paddingVertical: SPACING.md,
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },

  primaryButtonText: {
    color: COLORS.white,
    fontFamily: FONT.semiBold,
  },
});
