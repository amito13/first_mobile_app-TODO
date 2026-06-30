import React from "react";

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { Icon, LucideIcon } from "lucide-react-native";
import { COLORS } from "../../theme/colors";
import { RADIUS } from "../../theme/radius";
import { FONT } from "../../theme/typography";
import { Mail } from "lucide-react-native";
type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  icon?: LucideIcon;
};
export default function AppButton({
  title,
  onPress,
  loading = false,
  icon: Icon,
}: Props)


{
  const onPressHandler = () => {
    console.log("Button pressed");
    onPress();
  };
return (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={onPressHandler}
    style={styles.button}
    disabled={loading}
  >
    {loading ? (
      <ActivityIndicator color="#FFF" />
    ) : (
      <View style={styles.content}>
        {Icon && (
          <Icon
            size={20}
            color="#FFF"
            strokeWidth={2}
            style={{ marginRight: 12 }}
          />
        )}

        <Text style={styles.text}>
          {title}
        </Text>
      </View>
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
content: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
},  
text: {
  color: "#FFF",

  fontFamily: FONT.medium,

  fontSize: 18,
}
});