import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "@clerk/expo";
import { SafeAreaView } from "react-native-safe-area-context";
import SetTodo from "./SetTodo";
const Home = () => {
  const { user } = useUser();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>👋 Welcome Back</Text>
          <Text style={styles.name}>
            {user?.firstName ?? "User"}
          </Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName?.charAt(0)}
          </Text>
        </View>
      </View>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Today's Progress</Text>

        <Text style={styles.heroSubtitle}>
          Stay consistent and finish your tasks.
        </Text>

        <View style={styles.progressRow}>
          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>12</Text>
            <Text style={styles.progressLabel}>Tasks</Text>
          </View>

          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>7</Text>
            <Text style={styles.progressLabel}>Completed</Text>
          </View>

          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>5</Text>
            <Text style={styles.progressLabel}>Pending</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <TouchableOpacity style={styles.actionCard}>
        <Text style={styles.actionEmoji}>➕</Text>

        <View>
          <Text style={styles.actionTitle}>Create New Task</Text>

          <Text style={styles.actionSubtitle}>
            Add your next goal
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionCard}>
        <Text style={styles.actionEmoji}>📋</Text>

        <View>
          <Text style={styles.actionTitle}>View Tasks</Text>

          <Text style={styles.actionSubtitle}>
            Manage your todo list
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionCard}>
        <Text style={styles.actionEmoji}>📊</Text>

        <View>
          <Text style={styles.actionTitle}>Statistics</Text>

          <Text style={styles.actionSubtitle}>
            See your productivity
          </Text>
        </View>
      </TouchableOpacity>
      <SetTodo />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    color: "#94A3B8",
    fontSize: 16,
  },

  name: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 6,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  heroCard: {
    marginTop: 30,
    backgroundColor: "#1E293B",
    borderRadius: 22,
    padding: 20,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },

  heroSubtitle: {
    color: "#94A3B8",
    marginTop: 8,
    fontSize: 15,
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  progressItem: {
    alignItems: "center",
  },

  progressNumber: {
    color: "#3B82F6",
    fontSize: 28,
    fontWeight: "700",
  },

  progressLabel: {
    color: "#94A3B8",
    marginTop: 6,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 35,
    marginBottom: 15,
  },

  actionCard: {
    backgroundColor: "#1E293B",
    padding: 18,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  actionEmoji: {
    fontSize: 28,
    marginRight: 18,
  },

  actionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  actionSubtitle: {
    color: "#94A3B8",
    marginTop: 4,
  },
});