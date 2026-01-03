import { useSSO, useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

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
  const router = useRouter();

  const signInWithCredentials = async (identifier: string, password: string) => {
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      const res = await signIn!.create({ identifier, password });
      if (res.createdSessionId) {
        await setActive!({ session: res.createdSessionId });
        
        // Check if user is approved before redirecting
        try {
          const approvalRes = await fetch(`${API_BASE_URL}/api/users/approval-status`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!approvalRes.ok) {
            throw new Error("Failed to check approval status");
          }

          const { isApproved } = await approvalRes.json();

          if (!isApproved) {
            // Sign them out since they're not approved
            Alert.alert(
              "Account Pending Approval",
              "Your account is awaiting admin approval. You'll receive an email once approved."
            );
            return;
          }

          // User is approved, redirect to home
          router.replace("/");
        } catch (approvalError) {
          console.log("Approval check error:", approvalError);
          // If approval check fails, still allow sign in but show warning
          Alert.alert("Warning", "Could not verify account status. Please contact support.");
        }
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