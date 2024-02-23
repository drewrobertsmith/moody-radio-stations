import { FlatList, StyleSheet, Text } from "react-native";

import { LOCALSTATIONDATA } from "../api/localStationData";
import LocalStationItem from "./localStationItem";

export default function LocalStationFeed() {
  //filter by: A-Z, frequency,   
  
  const StationSelectItem = ({ item }) => {
    return <Text style={styles.title}>{item.name} {item.callLetters}</Text>;
  };

  return (
    <FlatList
      data={LOCALSTATIONDATA}
      renderItem={({ item }) => <StationSelectItem item={item} />}
      keyExtractor={(item) => item.name}
      contentContainerStyle={styles.titleContainer}
    />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingTop: 32,
    paddingBottom: null,
  },
  title: {
    fontWeight: "bold",
    padding: 8,
    fontSize: 24,
  },
});
