import { SafeAreaView, Text, View } from "react-native";

import SelectLocalStationFeed from "../components/selectLocalStationFeed";

export default function SelectLocalStations() {
  const SearchAndFilterStations = () => {
    return <Text>Search and Filter</Text>;
  };

  return (
    <SafeAreaView>
      <SearchAndFilterStations />
      <SelectLocalStationFeed />
    </SafeAreaView>
  );
}
