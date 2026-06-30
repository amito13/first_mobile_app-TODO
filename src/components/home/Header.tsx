import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Menu } from "lucide-react-native";
import { Image } from "expo-image";

import { COLORS } from "../../../theme/colors";
import { FONT } from "../../../theme/typography";

type HeaderProps = {
  name: string;
  avatar: string;
  onMenuPress: () => void;
  onAvatarPress: () => void;
};

export default function Header({
  name,
  avatar,
  onMenuPress,
  onAvatarPress,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={onMenuPress}
          activeOpacity={0.8}
        >
          <Menu
            size={30}
            color={COLORS.text}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onAvatarPress}
          activeOpacity={0.8}
        >
          <Image
            source={avatar}
            style={styles.avatar}
            contentFit="cover"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>
        My Tasks
      </Text>

      <Text style={styles.greeting}>
        Good Morning, {name} 👋
      </Text>

      <Text style={styles.subtitle}>
        Let's get things done.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },

  title: {
    fontFamily: FONT.heading,
    fontSize: 46,
    color: COLORS.text,
  },

  greeting: {
    marginTop: 12,
    fontFamily: FONT.medium,
    fontSize: 20,
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 6,
    fontFamily: FONT.body,
    fontSize: 17,
    color: COLORS.subText,
  },
});