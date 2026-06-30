import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

import { COLORS } from "../../../theme/colors";
import { FONT } from "../../../theme/typography";

type FilterTabsProps = {
  value: string;
  onChange: (tab: string) => void;
};

const tabs = [
  "All",
  "Pending",
  "Completed",
  "Important",
];

export default function FilterTabs({
  value,
  onChange,
}: FilterTabsProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const active = value === tab;

          return (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.8}
              onPress={() => onChange(tab)}
              style={[
                styles.tab,
                active && styles.activeTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  active && styles.activeText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 24,
  },

  scrollContent: {
    paddingHorizontal: 24,
    gap: 12,
  },

  tab: {
    paddingHorizontal: 22,
    paddingVertical: 12,

    borderRadius: 999,

    backgroundColor: "#F7E8D6",

    borderWidth: 1,

    borderColor: "#E4D3BD",
  },

  activeTab: {
    backgroundColor: COLORS.primary,

    borderColor: COLORS.primary,
  },

  tabText: {
    fontFamily: FONT.medium,

    fontSize: 15,

    color: COLORS.text,
  },

  activeText: {
    color: "#FFF",
  },
});