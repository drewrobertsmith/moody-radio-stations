import { Pressable, StyleSheet, Text, View } from "react-native";
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
} from "react-native-track-player";

import Ionicons from "@expo/vector-icons/Ionicons";
import { getNetworkStateAsync } from "expo-network";
import { parseString } from "react-native-xml2js";
import { useNetInfo } from "@react-native-community/netinfo";
import { useQuery } from "@tanstack/react-query";

export default function FloatingPlayer() {
  const { bufferingDuringPlay, playing } = useIsPlaying();
  const { isConnected } = useNetInfo();
  const activeTrack = useActiveTrack();
  console.log(activeTrack);

  /* Determines whether an active stream is playing and an ID is available to be displayed */
  let tritonId;
  if (activeTrack && activeTrack.id) {
    tritonId = activeTrack.id;
  } else {
    tritonId = null;
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
    queryKey: ["metadata", tritonId],
    queryFn: async () => {
      const response = await fetch(
        `https://np.tritondigital.com/public/nowplaying?mountName=${tritonId}&numberToFetch=1`
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

  /* parses the crappy triton xml response into something workable, and lets audio still play even if metadata is not available */
  const metadata = data?.["nowplaying-info-list"]?.["nowplaying-info"]?.[0]?.[
    "property"
  ] //checks for the existance of each field, otherwise return undefined
    ? data["nowplaying-info-list"]["nowplaying-info"][0]["property"].reduce(
        //if data exists, reduce array fields to single workable javascript object
        (acc, prop) => {
          acc[prop.$.name] = prop._;
          return acc;
        },
        {
          cue_title: `${activeTrack?.title}`,
          track_artist_name: `${activeTrack?.artist}`,
        }
      )
    : {
        //if fields return undefined return nothing
      };

  console.log(metadata);

  if (isConnected != true) {
    return (
      <Text>
        Unable to connect to the internet! Please check your network settings
      </Text>
    );
  } else {
    return (
      <View style={styles.floatingPlayerContainer}>
        <View style={styles.metadataContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {metadata?.cue_title}
          </Text>
          <Text numberOfLines={2}>{metadata?.track_artist_name}</Text>
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
}
const styles = StyleSheet.create({
  floatingPlayerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  metadataContainer: {
    paddingLeft: 8,
    flex: 0.9,
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
