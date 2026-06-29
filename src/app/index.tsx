import { useAuth, useUser } from "@clerk/expo";
import { AuthView, UserButton } from "@clerk/expo/native";
import { useEffect, useState } from "react";
import SetTodo from "./SetTodo";
import { Redirect } from "expo-router";
import {
  ActivityIndicator,
  Button,
  Modal,
  StyleSheet,
  View,
} from "react-native";

export default function MainScreen() {
  const { isLoaded, isSignedIn, getToken } = useAuth({
    treatPendingAsSignedOut: false,
  });

  const { user } = useUser();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

useEffect(() => {
  if (!isLoaded || !isSignedIn || !user || isSynced) return;

  const syncUser = async () => {
    try {
      setIsSyncing(true);

      const token = await getToken();

      if (!token) return;

      const response = await fetch(
        "http://192.168.29.177:3000/users/setUser",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to sync user");
      }

      setIsSynced(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSyncing(false);
    }
  };

  syncUser();
}, [isLoaded, isSignedIn, user]);

if (!isLoaded || isSyncing) {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
    </View>
  );
}

if (isSynced) {
  console.log("Redirecting to Home...");
  return <Redirect href="/SetTodo" />;
}

  return (
    <View style={styles.container}>
      {isSignedIn ? (
        <UserButton />
      ) : (
        <Button
          title="Sign in"
          onPress={() => setIsAuthOpen(true)}
        />
      )}

      <Modal
        visible={isAuthOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsAuthOpen(false)}
      >
        <AuthView onDismiss={() => setIsAuthOpen(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});