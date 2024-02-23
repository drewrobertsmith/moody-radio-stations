import { SafeAreaView, Text, View } from "react-native";

import LocalStationFeed from "../components/localStationFeed";

export default function LocalStations() {
  const SearchAndFilterStations = () => {
    return <Text>Search and Filter</Text>;
  };

  return (
    <SafeAreaView>
      <SearchAndFilterStations />
      <LocalStationFeed />
    </SafeAreaView>
  );
}
