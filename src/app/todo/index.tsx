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
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}
// const { getToken } = useAuth();


const TodosScreen = () => {
  const { getToken } = useAuth();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getTodos = useCallback(async () => {
    try {
      const token = await getToken();

      const response = await fetch(
        "http://192.168.29.177:3000/todos/getTodos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

     // console.log(data);

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

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }
    const deleteTodo = async (todoId: string) => {
    try {
      console.log("Deleting todo with ID:", todoId);
      const token = await getToken();
      console.log("Token:", token);

      const response = await fetch(
        
        `http://192.168.29.177:3000/todos/deleteTodo/${todoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
        
      );
      console.log("Response :", response);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log("Todo deleted");

      // Remove the deleted todo from the UI
      //setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
    } catch (error) {
      console.log("delete error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Todos</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/todo/create")}
        >
          <Text style={styles.addText}>＋</Text>
        </TouchableOpacity>
      </View>

      {todos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📝</Text>

          <Text style={styles.emptyTitle}>
            No Todos Yet
          </Text>

          <Text style={styles.emptySubtitle}>
            Tap the + button to create your first task.
          </Text>
        </View>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.topRow}>
                <Text style={styles.title}>
                  {item.title}
                </Text>

                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: item.completed
                        ? "#22C55E"
                        : "#F59E0B",
                    },
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {item.completed
                      ? "Completed"
                      : "Pending"}
                  </Text>
                </View>
              </View>

              <Text style={styles.description}>
                {item.description || "No description"}
              </Text>

              <View style={styles.bottomRow}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    router.push({
                      pathname: "/todo/edit/[id]",
                      params: { id: item.id },
                    })
                  }
                >
                  <Text style={styles.buttonText}>
                    Edit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteTodo(item.id)} 
                >
                  <Text style={styles.buttonText}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default TodosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingHorizontal: 18,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 10,
  },

  heading: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },

  addButton: {
    backgroundColor: "#2563EB",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  addText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  badgeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },

  description: {
    color: "#94A3B8",
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 18,
  },

  editButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },

  deleteButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyEmoji: {
    fontSize: 70,
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
  },

  emptySubtitle: {
    color: "#94A3B8",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 30,
  },
});