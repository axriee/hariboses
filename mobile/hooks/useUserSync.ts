import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { useApiClient, userApi } from "../utils/api";

export const useUserSync = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const api = useApiClient();

  const syncUserMutation = useMutation({
    mutationFn: () => userApi.syncUser(api),
    onSuccess: (response: any) => console.log("User synced successfully:", response.data.user),
    onError: (error) => console.error("User sync failed:", error),
  });

  useEffect(() => {
    // Only sync when Clerk is fully loaded and user is signed in
    if (isLoaded && isSignedIn && !syncUserMutation.data && !syncUserMutation.isPending) {
      syncUserMutation.mutate();
    }
  }, [isLoaded, isSignedIn]);

  return null;
};