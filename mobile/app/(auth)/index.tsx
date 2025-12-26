import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { useEmailUsernameAuth } from "../../hooks/useSocialAuth";
import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";

export default function Index() {
  const { handleEmailSignIn, handleUsernameSignIn, isLoading } = useEmailUsernameAuth();
  const { signUp, setActive, isLoaded: signUpLoaded } = useSignUp();

  // Sign-in fields
  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");

  // Sign-up modal state
  const [showSignup, setShowSignup] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleSubmit = async () => {
    const id = identifier.trim();
    const pwd = password.trim();
    if (!id || !pwd) return;
    const isEmail = id.includes("@");
    if (isEmail) {
      await handleEmailSignIn(id, pwd);
    } else {
      await handleUsernameSignIn(id, pwd);
    }
    setPassword("");
  };

  const handleSignup = async () => {
    if (!signUpLoaded) return;
    if (!signupEmail && !signupUsername) {
      Alert.alert("Missing info", "Provide an email or username.");
      return;
    }
    if (signupPassword.trim() !== signupConfirm.trim()) {
      Alert.alert("Passwords do not match");
      return;
    }
    setSignUpLoading(true);
    try {
      await signUp.create({
        emailAddress: signupEmail || undefined,
        username: signupUsername || undefined,
        password: signupPassword,
      });
      if (signupEmail) {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setShowSignup(false);
        setShowVerify(true);
      } else if (signUp.createdSessionId) {
        await setActive({ session: signUp.createdSessionId });
        setShowSignup(false);
      }
    } catch (err: any) {
      Alert.alert("Sign up error", err?.errors?.[0]?.message || "Could not create account");
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!signUpLoaded) return;
    const code = verificationCode.trim();
    if (!code) return;
    setVerifyLoading(true);
    try {
      const res = await signUp.attemptEmailAddressVerification({ code });
      if (res.createdSessionId) {
        await setActive({ session: res.createdSessionId });
      }
      setShowVerify(false);
      setVerificationCode("");
      setSignupEmail(""); setSignupUsername(""); setSignupPassword(""); setSignupConfirm("");
    } catch (err: any) {
      Alert.alert("Verification error", err?.errors?.[0]?.message || "Invalid code");
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ImageBackground
        source={require("../../assets/images/plm-grad.jpg")}
        className="flex-1 justify-center items-center"
        resizeMode="cover"
      >
        <View className="absolute inset-0 bg-black opacity-30" pointerEvents="none" />

        {/* Slogan */}
        <View className="items-center px-6 mb-8">
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

        {/* Inline fields and submit */}
        <View className="w-full items-center gap-3 px-5">
          <TextInput
            placeholder="Email or Username"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            keyboardType="email-address"
            className="w-full max-w-[360px] bg-white/95 rounded-full px-4 py-3 text-base"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="w-full max-w-[360px] bg-white/95 rounded-full px-4 py-3 text-base"
          />
          <TouchableOpacity
            className="w-full max-w-[360px] items-center justify-center bg-white/90 border border-white/60 rounded-full py-3.5 px-6"
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.85}
            style={shadowStyle}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#1f2a44" />
            ) : (
              <Text className="text-[#1f2a44] font-semibold text-base">Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Create account link */}
        <View className="mt-4 flex-row items-center">
          <Text className="text-white/85 text-sm">Don't have an account yet? </Text>
          <TouchableOpacity onPress={() => setShowSignup(true)} activeOpacity={0.8}>
            <Text className="text-white font-semibold text-sm underline">Create one!</Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Privacy */}
        <Text className="text-center text-white/80 text-xs leading-5 mt-6 px-4">
          By signing up, you agree to our <Text className="text-white font-semibold">Terms</Text>
          {", "}
          <Text className="text-white font-semibold">Privacy Policy</Text>
          {", and "}
          <Text className="text-white font-semibold">Cookie Use</Text>.
        </Text>
      </ImageBackground>

      {/* Sign-up Modal */}
      <Modal
        visible={showSignup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSignup(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-3xl p-6 w-full max-w-[400px]">
            <Text className="text-2xl font-bold text-[#1f2a44] mb-4">Create Account</Text>

            <TextInput
              placeholder="Email (optional if using username)"
              value={signupEmail}
              onChangeText={setSignupEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className="bg-gray-100 rounded-xl px-4 py-3 mb-3 text-base"
            />
            <TextInput
              placeholder="Username"
              value={signupUsername}
              onChangeText={setSignupUsername}
              autoCapitalize="none"
              className="bg-gray-100 rounded-xl px-4 py-3 mb-3 text-base"
            />
            <TextInput
              placeholder="Password"
              value={signupPassword}
              onChangeText={setSignupPassword}
              secureTextEntry
              className="bg-gray-100 rounded-xl px-4 py-3 mb-3 text-base"
            />
            <TextInput
              placeholder="Confirm Password"
              value={signupConfirm}
              onChangeText={setSignupConfirm}
              secureTextEntry
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4 text-base"
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-xl py-3"
                onPress={() => setShowSignup(false)}
              >
                <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-[#1f2a44] rounded-xl py-3"
                onPress={handleSignup}
                disabled={signUpLoading}
              >
                {signUpLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-center text-white font-semibold">Create</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Email verification Modal */}
      <Modal
        visible={showVerify}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVerify(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-3xl p-6 w-full max-w-[360px]">
            <Text className="text-xl font-bold text-[#1f2a44] mb-4">Verify Email</Text>

            <Text className="text-gray-700 mb-3">Enter the code we sent to your email.</Text>
            <TextInput
              placeholder="Verification code"
              value={verificationCode}
              onChangeText={setVerificationCode}
              autoCapitalize="none"
              keyboardType="number-pad"
              className="bg-gray-100 rounded-xl px-4 py-3 mb-4 text-base tracking-[4px]"
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-xl py-3"
                onPress={() => setShowVerify(false)}
                disabled={verifyLoading}
              >
                <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-[#1f2a44] rounded-xl py-3"
                onPress={handleVerify}
                disabled={verifyLoading}
              >
                {verifyLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-center text-white font-semibold">Verify</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const shadowStyle = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.18,
  shadowRadius: 6,
  elevation: 6,
};