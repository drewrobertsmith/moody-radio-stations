import { Pressable, StyleSheet, Text } from "react-native";
import { useEffect, useState } from "react";

import TrackPlayer from "react-native-track-player";
import { router } from "expo-router";

export default function LocalStationItem({
  localStationTitle,
  nearestStations,
  activeTrack,
}) {
  const [selectedStation, setSelectedStation] = useState(null);
  const [textColor, setTextColor] = useState("black");
  console.log("Active TRack: ", activeTrack);
  console.log("Selected Station ", selectedStation);

  useEffect(() => {
    if (activeTrack && activeTrack.id === selectedStation) {
      setTextColor("white");
    } else {
      setTextColor("black")
    }
  }, [selectedStation, activeTrack]);

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
        setSelectedStation(nearestStations.tritonId);
      }}
      onLongPress={() => {
        router.navigate("/localStations");
      }}
    >
      <Text style={[styles.title, { color: textColor }]}>
        {localStationTitle}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 40,
  },
});
