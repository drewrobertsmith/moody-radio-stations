import { Pressable, StyleSheet, Text, View } from "react-native";
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
} from "react-native-track-player";

import Ionicons from "@expo/vector-icons/Ionicons";
import { parseString } from "react-native-xml2js";
import { useQuery } from "@tanstack/react-query";

export default function FloatingPlayer() {
  const { bufferingDuringPlay, playing } = useIsPlaying();
  const activeTrack = useActiveTrack();

  /* Determines whether an active stream is playing and an ID is available to be displayed */
  let callLetters;
  if (activeTrack && activeTrack.id) {
    callLetters = activeTrack.id;
  } else {
    callLetters = null;
  }

  /* Determines whether a track is in a buffering, playing or not playing state and displays the appropriate button */
  let IconState;
  if (bufferingDuringPlay && bufferingDuringPlay === true) {
    IconState = "ellipsis-horizontal-circle";
    IconAction = null;
  } else if (playing === true) {
    IconState = "pause-circle";
  } else if (playing === false) {
    IconState = "play-circle";
  }

  /* Queries the Triton Nowplaying api for metadata. Only runs if activeTrack.Id is available and then refetches every minute */
  const { data } = useQuery({
    queryKey: ["metadata", callLetters],
    queryFn: async () => {
      const response = await fetch(
        `https://np.tritondigital.com/public/nowplaying?mountName=${callLetters}&numberToFetch=1`
      );
      if (!response.ok) {
        throw new Error("Network Response not okay");
      }

      const xmlText = await response.text();
      return new Promise((resolve, reject) => {
        parseString(xmlText, { trim: true }, (err, result) => {
          if (err) {
            reject(err);
          } else resolve(result);
        });
      });
    },
    refetchInterval: 60000, // refetch every 60000 milliseconds (60 seconds)
    enabled: !!activeTrack?.id, // only run the query if activeTrack.id is truthy
  });

  /* prases the crappy triton xml response into something workable */
  const metadata = data?.["nowplaying-info-list"]["nowplaying-info"][0][
    "property"
  ].reduce((acc, prop) => {
    acc[prop.$.name] = prop._;
    return acc;
  }, {});

  return (
    <View style={styles.floatingPlayerContainer}>
      <View style={styles.metadataContainer}>
        <Text style={styles.title}>{metadata?.cue_title}</Text>
        <Text>{metadata?.track_artist_name}</Text>
      </View>
      <Pressable
        onPress={() => {
          playing === true ? TrackPlayer.stop() : TrackPlayer.play();
        }}
      >
        <Ionicons name={IconState} size={72} style={styles.playIcon} />
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  floatingPlayerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metadataContainer: {
    paddingLeft: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  playIcon: {
    alignSelf: "flex-end",
    paddingRight: 32,
  },
});
