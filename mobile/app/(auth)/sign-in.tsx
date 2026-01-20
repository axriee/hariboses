import { useSignIn } from '@clerk/clerk-expo'
import React from 'react'
import { useRouter } from 'expo-router'
import { Text, TextInput, View, TouchableOpacity, ImageBackground, ActivityIndicator } from "react-native";


export default function Page() {
  const [isLoading, setIsLoading] = React.useState(false)
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onSignInPress = async () => {
    if (!isLoaded) return
    
    setIsLoading(true)
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/(tabs)')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-white">
      <ImageBackground
        source={require("../../assets/images/plm-grad.jpg")}
        className="flex-1 justify-center items-center"
        resizeMode="cover"
      >
        <View className="absolute inset-0 bg-black opacity-40" />  
        
        <View className="items-center px-6 mb-6">
          <Text
            className="text-white font-semibold text-2xl leading-7 tracking-tight"
            style={{
              textShadowColor: 'rgba(0,0,0,0.35)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 4,
            }}
          >
            SIGN IN
          </Text>
        </View>

        <TextInput
          className="flex-row items-center justify-center bg-slate-50 border border-transparent rounded-full py-3 px-6 mb-8 min-w-[280px]"
          style={shadowStyle}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        
        <TextInput
          className="flex-row items-center justify-center bg-slate-50 border border-transparent rounded-full py-3 px-6 mb-8 min-w-[280px]"
          style={shadowStyle}
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        <TouchableOpacity
          className="flex-row items-center justify-center bg-blue-900 border border-transparent rounded-full py-3 px-6 mb-8 min-w-[280px]"
          onPress={onSignInPress}
          disabled={isLoading}
          style={shadowStyle}
        >
          {isLoading && (
            <View className="absolute inset-0 items-center justify-center">
              <ActivityIndicator size="small" color="white" />
            </View>
          )}
          
          <View className={`flex-row items-center justify-center ${isLoading ? "opacity-0" : "opacity-100"}`}>
            <Text className="text-white font-medium text-base">Continue</Text>
          </View>
        </TouchableOpacity>

        <View className="flex-row items-center justify-center mt-2">
          <Text className="text-white text-xs">
            Don&apos;t have an account? 
          </Text>
          <TouchableOpacity onPress={() => router.push('/sign-up')}>
            <Text className="text-blue-900 font-bold text-xs"> Sign up</Text>
          </TouchableOpacity>
        </View>
          
      </ImageBackground>
    </View>
  );
}

const shadowStyle = {
  shadowColor: "black",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.8,
  shadowRadius: 10,
  elevation: 10,
};