import * as Location from "expo-location";

import { Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";

import { FontAwesome6 } from "@expo/vector-icons";
import { LOCALSTATIONDATA } from "../api/localStationData";
import LocalStationItem from "./localStationItem";
import { router } from "expo-router";

const DEFAULT = [
  {
    tritonId: "MB2",
    callLetters: "MB2",
    url: "https://playerservices.streamtheworld.com/api/livestream-redirect/MB2.mp3",
    name: "Moody Radio Network",
  },
];

export default function LocalStationContainer({ activeTrack }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nearestStations, setNearestStations] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      const stations = findNearestStations(location, LOCALSTATIONDATA);
      setNearestStations(stations);
    })();
  }, [setLocation]);

  function getDistanceFromStationInKm(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  function findNearestStations(location, stations) {
    return stations
      .filter((station) => {
        if (station.lat == null || station.lng == null) return false; // Skip stations with null coordinates
        const distance = getDistanceFromStationInKm(
          location.coords.latitude,
          location.coords.longitude,
          station.lat,
          station.lng
        );
        return distance <= 80.4672; // search radius is within 50 miles (in kilometers)
      })
      .sort((a, b) => {
        // Sort by distance to find the nearest
        const distanceA = getDistanceFromStationInKm(
          location.coords.latitude,
          location.coords.longitude,
          a.lat,
          a.lng
        );
        const distanceB = getDistanceFromStationInKm(
          location.coords.latitude,
          location.coords.longitude,
          b.lat,
          b.lng
        );
        return distanceA - distanceB;
      });
  }

  let text = "Waiting...";
  if (errorMsg) {
    text = errorMsg;
  } else if (location && nearestStations.length > 0) {
    text = nearestStations[0].name;
  } else if (location) {
    setNearestStations(DEFAULT);
  }

  return (
    <View style={styles.container}>
      <LocalStationItem
        localStationTitle={text}
        nearestStations={nearestStations[0]}
        activeTrack={activeTrack}
      />
      <Pressable
        onPress={() => {
          router.navigate("/selectLocalStations");
        }}
      >
        <FontAwesome6 name="location-dot" size={32} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 32,
  },
});
