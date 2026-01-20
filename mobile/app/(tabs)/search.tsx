import { Feather } from "@expo/vector-icons";
import { View, TextInput, ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// still hardcoded - to be implemented
const TRENDING_TOPICS = [
  { topic: "#TOR", posts: "125K" },
  { topic: "#coursedesc", posts: "89K" },
  { topic: "#wheredatGusali", posts: "234K" },
  { topic: "#HARIbussin", posts: "567K" },
  { topic: "#OJT", posts: "98K" },
];

const SearchScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER */}
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Feather name="search" size={20} color="#657786" />
          <TextInput
            placeholder="Search"
            className="flex-1 ml-3 text-base"
            placeholderTextColor="#657786"
          />
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="py-3"
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        style={{ flexGrow: 0 }}
      >
        {TRENDING_TOPICS.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            className="px-4 py-2 bg-white border border-gray-300 rounded-full"
            style={{ alignSelf: 'flex-start' }}
          >
            <Text className="font-medium text-gray-900 text-sm">{item.topic}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* shows feeds of topics clicked - to be implemented */}
    </SafeAreaView>
  );
};

export default SearchScreen;