import { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import DraggableFlatList from "react-native-draggable-flatlist";
import { STATIONDATA } from "../api/stationData";
import { StyleSheet } from "react-native";
import renderItem from "./stationTitle";

export default function StationFeed({ activeTrack }) {
  const [data, setData] = useState(STATIONDATA);

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

  /* renderItem for DraggableFlatlist needs to be wrapped to pass other properties down wiht it */
  const renderItemWithActiveTrack = ({ item, drag, isActive }) => {
    return renderItem({ activeTrack, item, drag, isActive });
  };

  return (
    <DraggableFlatList
      data={data}
      onDragEnd={({ data }) => setData(data)}
      renderItem={renderItemWithActiveTrack}
      keyExtractor={(item) => item.callLetters}
      contentContainerStyle={styles.stationFeed}
    />
  );
}
const styles = StyleSheet.create({
  stationFeed: {
    justifyContent: "space-evenly",
  },
});
