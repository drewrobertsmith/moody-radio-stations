import { StyleSheet, Text, View } from "react-native";
import { addTracks, setupPlayer } from "../services/trackPlayerServices";
import { useEffect, useState } from "react";

import { StatusBar } from "expo-status-bar";
import TrackPlayer from "react-native-track-player";

export default function App() {
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  //this intantiates the player using the setupPlayer() function from the trackservice
  useEffect(() => {
    async function setup() {
      const isSetup = await setupPlayer(); // The player is ready to be used
      const queue = await TrackPlayer.getQueue();
      if (isSetup && queue.length <= 0) {
        await addTracks();
      }
      setIsPlayerReady(isSetup);
    }
    setup();
  }, []);

  if (!isPlayerReady) {
    return <Text>Player is loading...</Text>;
  } else {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text>Hello World!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
