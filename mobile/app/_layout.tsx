import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name = "index" 
      options={{
        headerTitle: "HARIboses",
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
    </Stack>
}


