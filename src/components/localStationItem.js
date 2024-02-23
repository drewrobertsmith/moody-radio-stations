import { Pressable, StyleSheet, Text } from "react-native";

import TrackPlayer from "react-native-track-player";
import { router } from "expo-router";

export default function LocalStationItem({
  localStationTitle,
  nearestStations,
}) {
  return (
    <Pressable
      onPress={() => {
        TrackPlayer.load({
          id: nearestStations.tritonId,
          url: nearestStations.url,
          title: nearestStations.name,
          artist: "Moody Radio",
          isLiveStream: true,
        });
        TrackPlayer.play();
      }}
      onLongPress={() => {
        router.navigate("/localStations");
      }}
    >
      <Text style={styles.title}>{localStationTitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 40,
  },
});
