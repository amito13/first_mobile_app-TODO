import { useAuth, useUser } from "@clerk/expo";
import { AuthView, UserButton } from "@clerk/expo/native";
import { useEffect, useState } from "react";
import HeroHeader from "../components/HeroHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { IMAGES } from "../../assets/images";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import {
  ActivityIndicator,
  Button,
  Modal,
  StyleSheet,
  View,Text
} from "react-native";
import { COLORS } from "../../theme/colors";
import { FONT } from "../../theme/typography";
import AppButton from "../components/AppButton";


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
  return <Redirect href="/Home" />;
}

  return (
    
//     <SafeAreaView style={styles.container}>
    
//     {/* <HeroHeader
//         source={IMAGES.authHeader}
//         height={400}
//     />
// <View style={styles.content}>

//     <Text style={styles.title}>
//         Todo
//     </Text>

//     <Text style={styles.subtitle}>
//         Organize your tasks,
//         {"\n"}
//         find your peace.
//     </Text>

// </View>

//       {isSignedIn ? (
//         <UserButton />
//       ) : (
//         <AppButton
//           title="Sign In"
//           onPress={() => {}}
//       />
//       )}

//       <Modal
//         visible={isAuthOpen}
//         animationType="slide"
//         presentationStyle="pageSheet"
//         onRequestClose={() => setIsAuthOpen(false)}
//       >
//         <AuthView onDismiss={() => setIsAuthOpen(false)} />
//       </Modal> */}
     
//     </SafeAreaView>
<SafeAreaView style={styles.container}>

    <Image
        source={IMAGES.authHeader}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
    />
<View style={styles.authCard}>
  <Text style={styles.title}>Todo</Text>

  <Text style={styles.subtitle}>
    Organize your tasks,{"\n"}
    find your peace.
  </Text>
  <AppButton
    title="Sign In"
    onPress={() => {}}
/>
</View>

</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1
  },
content: {
  flex: 1,

  marginTop: -35,

  backgroundColor: COLORS.background,

  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,

  paddingHorizontal: 24,
  paddingTop: 80,
},
title: {
  fontFamily: FONT.heading,
  fontSize: 48,
  color: COLORS.text,
  textAlign: "center",
},
subtitle: {
  marginTop: 12,

  fontFamily: FONT.body,

  fontSize: 16,

  lineHeight: 24,

  color: COLORS.subText,

  textAlign: "center",
},
authCard: {
  position: "absolute",
  left: 24,
  right: 24,
  bottom: 32,

  borderRadius: 30,

  padding: 24,

  backgroundColor: "rgba(255,255,255,0.18)",

  borderWidth: 1,

  borderColor: "rgba(255,255,255,0.25)",
}
});