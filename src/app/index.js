import { Button, StyleSheet, Text, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TrackPlayer, { useActiveTrack } from "react-native-track-player";
import {
  addTracks,
  playbackService,
  setupPlayer,
} from "../services/trackPlayerServices";
import { useEffect, useState } from "react";

import FloatingPlayer from "../components/floatingPlayer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { STATIONDATA } from "../api/stationData";
import StationFeed from "../components/stationFeed";
import { StatusBar } from "expo-status-bar";

//Register background events for the notfication shades
TrackPlayer.registerPlaybackService(() => playbackService);

export default function App() {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [currentBackgroundColor, setCurrentBackgroundColor] =
    useState("#74a433");
  const activeTrack = useActiveTrack();
  const queryClient = new QueryClient();

  //this intantiates the player using the setupPlayer() function from the trackservice
  useEffect(() => {
    async function setup() {
      const isSetup = await setupPlayer(); // The player is ready to be used
      const queue = await TrackPlayer.getQueue();
      if (isSetup && queue.length <= 0) {
        await addTracks();
      }
      setIsPlayerReady(isSetup);
      console.log("player is ready");
    }
    setup();
  }, []);

  //this determines the background color of the app based on the current playing stream
  useEffect(() => {
    if (activeTrack && activeTrack.url) {
      const station = STATIONDATA.find((s) => s.url === activeTrack.url);
      if (station) {
        setCurrentBackgroundColor(station.backgroundColor);
      }
    }
  }, [activeTrack]);

  if (!isPlayerReady) {
    return <Text>Player is loading...</Text>;
  } else {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="auto" />
          <View
            style={[
              styles.container,
              { backgroundColor: currentBackgroundColor },
            ]}
          >
            <StationFeed activeTrack={activeTrack} />
            <FloatingPlayer />
          </View>
        </QueryClientProvider>
      </GestureHandlerRootView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    justifyContent: "space-between",
  },
});
