import { Text, View, TouchableOpacity, ImageBackground, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const isLoading = false; 
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <ImageBackground
        source={require("../../assets/images/plm-grad.jpg")}
        className="flex-1 justify-center items-center"
        resizeMode="cover"
      >
      <View className="absolute inset-0 bg-black opacity-40" />  
        {/* Header Text */}
        <View className="items-center px-6 mb-6">
          <Text
            className="text-white font-semibold text-2xl leading-7 tracking-tight"
            style={{
              textShadowColor: 'rgba(0,0,0,0.35)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 4,
            }}
          >
            Boses ng Iskolar,
          </Text>
          <Text
            className="text-white/90 font-medium text-lg leading-6 tracking-tight"
            style={{
              textShadowColor: 'rgba(0,0,0,0.35)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 4,
            }}
          >
            Lakas ng Pamantasan
          </Text>
        </View>

        {/* SIGN IN Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-blue-900 border border-transparent rounded-full py-3 px-6 mb-8 min-w-[280px]"
          onPress={() => router.push("/sign-in")}
          disabled={isLoading}
          style={shadowStyle}
        >
          {isLoading && (
            <View className="absolute inset-0 items-center justify-center">
              <ActivityIndicator size="small" color="white" />
            </View>
          )}
          
          <View className={`flex-row items-center justify-center ${isLoading ? "opacity-0" : "opacity-100"}`}>
            <Text className="text-white font-medium text-base">SIGN IN</Text>
          </View>
        </TouchableOpacity>

        {/* SIGN UP Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-blue-900 border border-transparent rounded-full py-3 px-6 mb-8 min-w-[280px]"
          onPress={() => router.push("/sign-up")}
          disabled={isLoading}
          style={shadowStyle}
        >
          {/* 1. The Spinner (Absolute ensures it doesn't push the text) */}
          {isLoading && (
            <View className="absolute inset-0 items-center justify-center">
              <ActivityIndicator size="small" color="white" />
            </View>
          )}

          {/* 2. The Content (Opacity-0 keeps the width/height but hides it) */}
          <View className={`flex-row items-center justify-center ${isLoading ? "opacity-0" : "opacity-100"}`}>
             <Text className="text-white font-medium text-base">SIGN UP</Text>
          </View>
        </TouchableOpacity>

        {/* Terms and Privacy */}
          <Text className="text-center text-white text-xs leading-4 mt-2 px-2 shadow-lg-white-lg">
            By signing up, you agree to our <Text className="text-blue-900 font-bold">Terms</Text>, <Text className="text-blue-900 font-bold">Privacy Policy</Text>, and <Text className="text-blue-900 font-bold">Cookie Use</Text>.
          </Text>
      </ImageBackground>
    </View>
  );
}

// Extracted shadow style to keep code clean
const shadowStyle = {
  shadowColor: "black",
  shadowOffset: { width: 0, height: 4 }, // Changed width to 0 for better glow effect
  shadowOpacity: 0.8,
  shadowRadius: 10,
  elevation: 10,
};