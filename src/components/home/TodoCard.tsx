import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Circle,
  CircleCheckBig,
  CalendarDays,
  Bookmark,
} from "lucide-react-native";

import { COLORS } from "..//../../theme/colors";
import { FONT } from "../../../theme/typography";

type TodoCardProps = {
  title: string;
  date: string;
  completed: boolean;
  important?: boolean;

  onToggle: () => void;
  onBookmark: () => void;
};

export default function TodoCard({
  title,
  date,
  completed,
  important = false,
  onToggle,
  onBookmark,
}: TodoCardProps) {
  return (
    <View style={styles.card}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onToggle}
        >
          {completed ? (
            <CircleCheckBig
              size={28}
              color={COLORS.primary}
            />
          ) : (
            <Circle
              size={28}
              color="#C8A97E"
            />
          )}
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            completed && styles.completedTitle,
          ]}
        >
          {title}
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onBookmark}
        >
          <Bookmark
            size={22}
            color={
              important
                ? COLORS.primary
                : "#8F857A"
            }
            fill={
              important
                ? COLORS.primary
                : "transparent"
            }
          />
        </TouchableOpacity>
      </View>

      {/* Bottom Row */}
      <View style={styles.bottomRow}>
        <CalendarDays
          size={16}
          color="#8F857A"
        />

        <Text style={styles.date}>
          {date}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 24,
    marginBottom: 18,

    padding: 20,

    borderRadius: 24,

    backgroundColor: "#FFF8F1",

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 18,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 6,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    flex: 1,

    marginHorizontal: 14,

    fontFamily: FONT.medium,

    fontSize: 20,

    color: COLORS.text,
  },

  completedTitle: {
    textDecorationLine: "line-through",

    color: "#9C9288",
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 16,

    marginLeft: 42,
  },

  date: {
    marginLeft: 8,

    fontFamily: FONT.body,

    fontSize: 15,

    color: "#8F857A",
  },
});