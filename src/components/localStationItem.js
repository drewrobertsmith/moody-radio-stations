import { Pressable, StyleSheet, Text } from "react-native";

import TrackPlayer from "react-native-track-player";

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
    >
      <Text style={styles.title}>{localStationTitle}</Text>
    </Pressable>
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
