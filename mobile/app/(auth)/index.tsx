import { Text, View, Image, TouchableOpacity, ImageBackground, ActivityIndicator, Alert } from "react-native";
import { useSocialAuth, useEmailUsernameAuth } from "../../hooks/useSocialAuth";  

export default function Index() {
  const { handleSocialAuth, isLoading: ssoLoading } = useSocialAuth();
  const { handleEmailSignIn, handleUsernameSignIn, isLoading: credLoading } = useEmailUsernameAuth();

  return (
    <View className="flex-1 bg-white">
      <ImageBackground
        source={require("../../assets/images/plm-grad.jpg")}
        className="flex-1 justify-center items-center"
        resizeMode="cover"
      >
        <View className="absolute inset-0 bg-black opacity-30" pointerEvents="none" />

        {/* Slogan */}
        <View className="items-center px-6 mb-10">
          <Text
            className="text-white/90 font-semibold text-xl leading-7 tracking-tight"
            style={{
              textShadowColor: "rgba(0,0,0,0.25)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 5,
            }}
          >
            Boses ng Iskolar,
          </Text>
          <Text
            className="text-white/80 font-medium text-lg leading-6 tracking-tight"
            style={{
              textShadowColor: "rgba(0,0,0,0.25)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 5,
            }}
          >
            Lakas ng Pamantasan
          </Text>
        </View>

        {/* Buttons */}
        <View className="w-full items-center gap-4 px-5">
          {/* Email Button */}
          <TouchableOpacity
            className="w-full max-w-[360px] flex-row items-center justify-center bg-white/90 border border-white/60 rounded-full py-3.5 px-6"
            onPress={() => Alert.alert("Pressed")}
            disabled={credLoading}
            style={shadowStyle}
            activeOpacity={0.8}
          >
            {ssoLoading && (
              <View className="absolute inset-0 items-center justify-center">
                <ActivityIndicator size="small" color="#1f2a44" />
              </View>
            )}

            <View className={`flex-row items-center justify-center ${ssoLoading ? "opacity-0" : "opacity-100"}`}>
              <Image
                source={require("../../assets/images/email-logo.png")}
                className="size-10 mr-3"
                resizeMode="contain"
                style={{ tintColor: "#1f2a44" }}
              />
              <Text className="text-[#1f2a44] font-semibold text-base">Continue with Email</Text>
            </View>
          </TouchableOpacity>

          {/* Username Button */}
          <TouchableOpacity
            className="w-full max-w-[360px] flex-row items-center justify-center bg-white/90 border border-white/60 rounded-full py-3.5 px-6"
            onPress={() => Alert.alert("Pressed")}
            disabled={credLoading}
            style={shadowStyle}
            activeOpacity={0.8}
          >
            {ssoLoading && (
              <View className="absolute inset-0 items-center justify-center">
                <ActivityIndicator size="small" color="#1f2a44" />
              </View>
            )}

            <View className={`flex-row items-center justify-center ${ssoLoading ? "opacity-0" : "opacity-100"}`}>
              <Image
                source={require("../../assets/images/username-logo.png")}
                className="size-10 mr-3"
                resizeMode="contain"
                style={{ tintColor: "#1f2a44" }}
              />
              <Text className="text-[#1f2a44] font-semibold text-base">Continue with Username</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Terms and Privacy */}
        <Text className="text-center text-white/80 text-xs leading-5 mt-4 px-4">
          By signing up, you agree to our <Text className="text-white font-semibold">Terms</Text>
          {", "}
          <Text className="text-white font-semibold">Privacy Policy</Text>
          {", and "}
          <Text className="text-white font-semibold">Cookie Use</Text>.
        </Text>
      </ImageBackground>
    </View>
  );
}

// Extracted shadow style to keep code clean
const shadowStyle = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.18,
  shadowRadius: 6,
  elevation: 6,
};