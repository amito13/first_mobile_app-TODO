import React from "react";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";

type HeroArtworkProps = {
  source: any;
};

export default function HeroArtwork({
  source,
}: HeroArtworkProps) {
  return (
    <Image
      source={source}
      contentFit="cover"
      style={styles.image}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 250,

    borderRadius: 28,

    marginTop: 20,
  },
});