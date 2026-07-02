
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { COLORS } from "../../../theme/colors";
import { RADIUS } from "../../../theme/radius";
import { SHADOW } from "../../../theme/shadows";
import { SPACING } from "../../../theme/spacing";
import { FONT } from "../../../theme/typography";
import React, { useCallback, useEffect, useState } from "react";
    import {
      ActivityIndicator,
      FlatList,
      RefreshControl,
      StyleSheet,
      Text,
      TouchableOpacity,
      View,
    } from "react-native";
   
interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}
// const { getToken } = useAuth();




    interface Todo {
      id: string;
      title: string;
      description: string;
      completed: boolean;
    }

    const TodosScreen = () => {
      const { getToken } = useAuth();

      const [todos, setTodos] = useState<Todo[]>([]);
      const [loading, setLoading] = useState(true);
      const [refreshing, setRefreshing] = useState(false);

      const getTodos = useCallback(async () => {
        try {
          const token = await getToken();

          const response = await fetch(process.env.EXPO_PUBLIC_GET_TODO_URL!, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

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
        getTodos();
      }, [getTodos]);

      const onRefresh = () => {
        setRefreshing(true);
        getTodos();
      };

      const deleteTodo = async (todoId: string) => {
        try {
          const token = await getToken();

          const response = await fetch(
            process.env.EXPO_PUBLIC_DELETE_TODO_URL! + `/${todoId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message);
          }

          setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
        } catch (error) {
          console.log("delete error:", error);
        }
      };

      const completedCount = todos.filter((todo) => todo.completed).length;
      const pendingCount = todos.length - completedCount;

      if (loading) {
        return (
          <SafeAreaView style={styles.container}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading your tasks...</Text>
            </View>
          </SafeAreaView>
        );
      }

      return (
        <SafeAreaView style={styles.container}>
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <>
                <View style={styles.backdropTop} />
                <View style={styles.backdropBottom} />

                <View style={styles.header}>
                  <View style={styles.headerCopy}>
                    <Text style={styles.kicker}>Todos</Text>
                    <Text style={styles.heading}>My Tasks</Text>
                    <Text style={styles.subtitle}>
                      Track what is pending, what is done, and keep moving.
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.addButton}
                    activeOpacity={0.85}
                    onPress={() => router.push("/todo/create")}
                  >
                    <Text style={styles.addText}>＋</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.heroCard}>
                  <Text style={styles.heroTitle}>Your task overview</Text>
                  <Text style={styles.heroBody}>
                    Everything here is pulled from the live backend so the screen
                    stays in sync with your real todos.
                  </Text>

                  <View style={styles.metricRow}>
                    <View style={styles.metricCard}>
                      <Text style={styles.metricValue}>{todos.length}</Text>
                      <Text style={styles.metricLabel}>Tasks</Text>
                    </View>

                    <View style={styles.metricCard}>
                      <Text style={styles.metricValue}>{completedCount}</Text>
                      <Text style={styles.metricLabel}>Completed</Text>
                    </View>

                    <View style={styles.metricCard}>
                      <Text style={styles.metricValue}>{pendingCount}</Text>
                      <Text style={styles.metricLabel}>Pending</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Tasks</Text>
                  <Text style={styles.sectionHint}>Latest items from your list</Text>
                </View>
              </>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyEmoji}>📝</Text>
                  <Text style={styles.emptyTitle}>No Todos Yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Tap the create button to add your first task.
                  </Text>
                  <TouchableOpacity
                    style={styles.emptyButton}
                    activeOpacity={0.85}
                    onPress={() => router.push("/todo/create")}
                  >
                    <Text style={styles.emptyButtonText}>Create Todo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.topRow}>
                  <View style={styles.titleWrap}>
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor: item.completed
                            ? COLORS.success
                            : COLORS.primary,
                        },
                      ]}
                    />
                    <Text style={styles.title}>{item.title}</Text>
                  </View>

                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: item.completed
                          ? "rgba(46, 139, 87, 0.14)"
                          : "rgba(178, 58, 42, 0.14)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        {
                          color: item.completed ? COLORS.success : COLORS.primary,
                        },
                      ]}
                    >
                      {item.completed ? "Completed" : "Pending"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.description}>
                  {item.description || "No description"}
                </Text>

                <View style={styles.bottomRow}>
                  <TouchableOpacity
                    style={styles.editButton}
                    activeOpacity={0.85}
                    onPress={() =>
                      router.push({
                        pathname: "/todo/edit/[id]",
                        params: { id: item.id },
                      })
                    }
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    activeOpacity={0.85}
                    onPress={() => deleteTodo(item.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListFooterComponent={<View style={styles.footerSpace} />}
          />
        </SafeAreaView>
      );
    };

    export default TodosScreen;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: COLORS.background,
      },

      loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: SPACING.sm,
      },

      loadingText: {
        color: COLORS.subText,
        fontFamily: FONT.medium,
      },

      listContent: {
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
        bottom: 120,
        left: -100,
        width: 210,
        height: 210,
        borderRadius: 105,
        backgroundColor: "rgba(200, 90, 68, 0.1)",
      },

      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: SPACING.md,
      },

      headerCopy: {
        flex: 1,
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
        marginTop: SPACING.xs,
        fontSize: 14,
        lineHeight: 21,
        fontFamily: FONT.body,
      },

      addButton: {
        backgroundColor: COLORS.primary,
        width: 56,
        height: 56,
        borderRadius: RADIUS.round,
        justifyContent: "center",
        alignItems: "center",
        ...SHADOW,
      },

      addText: {
        color: COLORS.white,
        fontSize: 28,
        fontFamily: FONT.bold,
      },

      heroCard: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.xl,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOW,
      },

      heroTitle: {
        color: COLORS.text,
        fontSize: 22,
        fontFamily: FONT.bold,
      },

      heroBody: {
        color: COLORS.subText,
        marginTop: SPACING.xs,
        fontFamily: FONT.body,
        lineHeight: 21,
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

      card: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.xl,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOW,
      },

      topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: SPACING.sm,
      },

      titleWrap: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: SPACING.sm,
      },

      statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 7,
      },

      title: {
        flex: 1,
        color: COLORS.text,
        fontSize: 18,
        fontFamily: FONT.semiBold,
      },

      badge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: 6,
        borderRadius: RADIUS.round,
      },

      badgeText: {
        fontFamily: FONT.semiBold,
        fontSize: 12,
      },

      description: {
        color: COLORS.subText,
        marginTop: SPACING.md,
        fontSize: 15,
        lineHeight: 22,
        fontFamily: FONT.body,
      },

      bottomRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: SPACING.md,
        gap: SPACING.sm,
      },

      editButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        borderRadius: RADIUS.round,
        ...SHADOW,
      },

      deleteButton: {
        backgroundColor: COLORS.secondary,
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        borderRadius: RADIUS.round,
        ...SHADOW,
      },

      buttonText: {
        color: COLORS.white,
        fontFamily: FONT.semiBold,
      },

      emptyContainer: {
        paddingTop: SPACING.xl,
        justifyContent: "center",
        alignItems: "center",
      },

      emptyCard: {
        width: "100%",
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.xl,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: "center",
        ...SHADOW,
      },

      emptyEmoji: {
        fontSize: 70,
      },

      emptyTitle: {
        color: COLORS.text,
        fontSize: 24,
        fontFamily: FONT.bold,
        marginTop: SPACING.md,
      },

      emptySubtitle: {
        color: COLORS.subText,
        fontSize: 16,
        marginTop: SPACING.sm,
        textAlign: "center",
        lineHeight: 22,
        fontFamily: FONT.body,
      },

      emptyButton: {
        marginTop: SPACING.lg,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.round,
        ...SHADOW,
      },

      emptyButtonText: {
        color: COLORS.white,
        fontFamily: FONT.semiBold,
      },

      footerSpace: {
        height: SPACING.lg,
      },
    });
