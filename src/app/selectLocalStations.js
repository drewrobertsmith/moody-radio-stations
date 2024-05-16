import { SafeAreaView, Text, View } from "react-native";

import SelectLocalStationFeed from "../components/selectLocalStationFeed";
import { router } from "expo-router";

export default function SelectLocalStations() {

  const SearchAndFilterStations = () => {
    return <Text>Search and Filter</Text>;
  };

  return (
    <SafeAreaView>
      <SelectLocalStationFeed />
    </SafeAreaView>
  );
}
