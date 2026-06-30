import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { COLORS } from "../../theme/colors";
import { RADIUS } from "../../theme/radius";
import { FONT } from "../../theme/typography";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
};

export default function AppButton({
  title,
  onPress,
  loading = false,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.button}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
button: {
  height: 58,

  borderRadius: 18,

  backgroundColor: "#A62C22",

  justifyContent: "center",

  alignItems: "center",

  marginTop: 10,

  shadowColor: "#7B1E16",

  shadowOpacity: 0.3,

  shadowRadius: 12,

  shadowOffset: {
    width: 0,
    height: 6,
  },

  elevation: 8,
},
text: {
  color: "#FFF",

  fontFamily: FONT.medium,

  fontSize: 18,
}
});