import { Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";

import { ScaleDecorator } from "react-native-draggable-flatlist";
import TrackPlayer from "react-native-track-player";

export default function renderItem({
  activeTrack,
  item,
  drag,
  isActive,
}) {
  const [selectedStation, setSelectedStation] = useState(null);
  const [textColor, setTextColor] = useState("black");

  useEffect(() => {
    if (activeTrack && activeTrack.id === selectedStation) {
      setTextColor(item.textColor);
    } else {
      setTextColor("black");
    }
  }, [selectedStation, activeTrack]);

  return (
    <View style={styles.titleContainer}>
      <ScaleDecorator>
        <Pressable
          onLongPress={drag}
          disabled={isActive}
          onPress={() => {
            TrackPlayer.load({
              id: item.callLetters,
              url: item.url,
              title: item.name,
              artist: "Moody Radio",
              isLiveStream: true,
            });
            TrackPlayer.play();
            setSelectedStation(item.callLetters);
          }}
        >
          <Text style={[styles.title, { color: textColor }]}>{item.name}</Text>
        </Pressable>
      </ScaleDecorator>
    </View>
  );
}
const styles = StyleSheet.create({
  titleContainer: {
    paddingTop: 32,
    paddingBottom: null,
  },
  title: {
    fontWeight: "bold",
    fontSize: 40,
  },
});
