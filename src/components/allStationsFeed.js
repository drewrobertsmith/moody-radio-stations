import { MUSICSTATIONDATA, STATIONDATA } from "../api/musicStationData";
import { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import DraggableFlatList from "react-native-draggable-flatlist";
import LocalStationContainer from "./localStationContainer";
import MusicStationItem from "./musicStationItem";
import { StyleSheet } from "react-native";

export default function AllStationsFeed({ activeTrack }) {
  const [data, setData] = useState(MUSICSTATIONDATA);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("station order");
        if (storedData !== null) {
          setData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("error fetching data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem("station order", jsonValue);
      } catch (error) {
        console.error("Error saving data to AsyncStorage", error);
      }
    };

    if (data !== null) {
      saveData();
    }
  }, [data]);

  /* renderItem component for DraggableFlatlist needs to be wrapped to pass other properties down wiht it */
  const renderItemWithActiveTrack = ({ item, drag, isActive }) => {
    return MusicStationItem({ activeTrack, item, drag, isActive });
  };

  return (
    <DraggableFlatList
      ListHeaderComponent={<LocalStationContainer activeTrack={activeTrack} />}
      data={data}
      onDragEnd={({ data }) => setData(data)}
      renderItem={renderItemWithActiveTrack}
      keyExtractor={(item) => item.callLetters}
      contentContainerStyle={styles.stationFeed}
      bounces={true}
      overScrollMode="always"
    />
  );
}
const styles = StyleSheet.create({
  stationFeed: {
    justifyContent: "space-evenly",
    paddingTop: "15%",
  },
});
