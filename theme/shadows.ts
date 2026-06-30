import { Platform } from "react-native";

export const SHADOW = Platform.select({
  ios: {
    shadowColor: "#C8A98B",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },

  android: {
    elevation: 8,
  },
});