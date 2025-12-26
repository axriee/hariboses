import { useSSO, useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

// Google/Apple SSO (matches current index.tsx usage)
export const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    setIsLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      console.log("Error in social auth", err);
      const provider = strategy === "oauth_google" ? "Google" : "Apple";
      Alert.alert("Error", `Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleSocialAuth };
};

// Email or Username + Password credentials
export const useEmailUsernameAuth = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);

  const signInWithCredentials = async (identifier: string, password: string) => {
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      const res = await signIn!.create({ identifier, password });
      if (res.createdSessionId) {
        await setActive!({ session: res.createdSessionId });
      }
      return res;
    } catch (err: any) {
      const message = err?.errors?.[0]?.message || "Sign in failed. Please check your credentials.";
      Alert.alert("Sign In Error", message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (email: string, password: string) =>
    signInWithCredentials(email.trim(), password);

  const handleUsernameSignIn = async (username: string, password: string) =>
    signInWithCredentials(username.trim(), password);

  return { isLoading, handleEmailSignIn, handleUsernameSignIn };
};