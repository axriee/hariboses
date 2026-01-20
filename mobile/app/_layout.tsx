import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { ClerkProvider } from "@clerk/clerk-expo";  
import { Stack } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    
    <ClerkProvider 
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
    <QueryClientProvider client={queryClient}>
    <Stack >
        <Stack.Screen name="(auth)" options={{headerShown: false}}/>
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
    </Stack>
    </QueryClientProvider>
    </ClerkProvider>
  )
}
