import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { LOCALSTATIONDATA } from "../api/localStationData";
import LocalStationItem from "./localStationItem";
import { router } from "expo-router";

export default function SelectLocalStationFeed() {
  //filter by: A-Z, frequency,

  const StationSelectItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => {
          router.back();
        }}
      >
        <Text style={styles.title}>
          {item.name} {item.callLetters}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.localStationListContainer}>
      <FlatList
        data={LOCALSTATIONDATA}
        renderItem={({ item }) => <StationSelectItem item={item} />}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.titleContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  localStationListContainer: {
    padding: 16
  },
  titleContainer: {

  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    margin: 8
  },
});
