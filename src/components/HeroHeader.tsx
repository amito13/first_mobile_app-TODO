import { StyleSheet } from "react-native";
import { Image } from "expo-image";

type HeroHeaderProps = {
  source: any;
  height: number;
};

export default function HeroHeader({
  source,
  height,
}: HeroHeaderProps) {
  return (
    <Image
      source={source}
      contentFit="cover"
      style={[
        styles.image,
        {
          height,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
 image:{
    width:"100%",
    overflow:"hidden",
    borderBottomLeftRadius:30,
    borderBottomRightRadius:30,
}
});