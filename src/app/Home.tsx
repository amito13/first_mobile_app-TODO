import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../components/home/Header";
import HeroArtwork from "../components/home/HeroArtwork";
import FilterTabs from "../components/home/FilterTabs";
import TodoCard from "../components/home/TodoCard";
import {
  Image,
  Modal
} from "react-native";
import { useAuth } from "@clerk/expo";
import { useUser } from "@clerk/expo";
import { SafeAreaView } from "react-native-safe-area-context";

import {router} from "expo-router";
import { IMAGES } from "@/assets/images";
const Home = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [profileVisible, setProfileVisible] = useState(false);  
  const [selectedTab, setSelectedTab] = useState("All");
  return (

    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ScrollView>
    
      <View style={styles.header}>
        { <TouchableOpacity
            style={styles.avatar}
            onPress={() => setProfileVisible(true)}
          >
            <Text style={styles.avatarText}>
              {user?.firstName?.charAt(0)}
            </Text>
        </TouchableOpacity> 
        }
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

      <TouchableOpacity style={styles.actionCard}
      onPress={() => router.push("/todo/create")}  
      >
        <Text style={styles.actionEmoji}>➕</Text>

        <View>
          <Text style={styles.actionTitle}>Create New Task</Text>

          <Text style={styles.actionSubtitle}>
            Add your next goal
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionCard}
      onPress={() => router.push("t/odo")}>
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

      <Modal
  visible={profileVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setProfileVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.profileCard}>

      <Image
        source={{ uri: user?.imageUrl }}
        style={styles.profileImage}
      />

      <Text style={styles.profileName}>
        {user?.fullName}
      </Text>

      <Text style={styles.profileEmail}>
        {user?.primaryEmailAddress?.emailAddress}
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>User ID</Text>
        <Text style={styles.infoText}>{user?.id}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Username</Text>
        <Text style={styles.infoText}>
          {user?.username ?? "Not Set"}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Phone</Text>
        <Text style={styles.infoText}>
          {user?.primaryPhoneNumber?.phoneNumber ??
            "Not Available"}
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

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setProfileVisible(false)}
      >
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeButton}
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
          <Text style={styles.closeText}>Sign Out</Text>
        </TouchableOpacity>

    </View>
  </View>
</Modal>
</ScrollView>
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
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.6)",
  justifyContent: "center",
  alignItems: "center",
},

profileCard: {
  width: "90%",
  backgroundColor: "#1E293B",
  borderRadius: 25,
  padding: 25,
  alignItems: "center",
},

profileImage: {
  width: 100,
  height: 100,
  borderRadius: 50,
  marginBottom: 20,
},

profileName: {
  color: "#fff",
  fontSize: 24,
  fontWeight: "700",
},

profileEmail: {
  color: "#94A3B8",
  marginBottom: 20,
},

infoBox: {
  width: "100%",
  backgroundColor: "#0F172A",
  borderRadius: 12,
  padding: 14,
  marginBottom: 12,
},

infoTitle: {
  color: "#94A3B8",
  fontSize: 12,
},

infoText: {
  color: "#fff",
  fontSize: 16,
  marginTop: 5,
},

closeButton: {
  marginTop: 20,
  backgroundColor: "#2563EB",
  paddingVertical: 14,
  paddingHorizontal: 40,
  borderRadius: 12,
},

closeText: {
  color: "#fff",
  fontWeight: "700",
},
});