import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, ImageBackground, ActivityIndicator } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

export default function SignUpScreen() {
  const [isLoading, setIsLoading] = React.useState(false)
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) return

    setIsLoading(true)
    try {
      await signUp.create({
        emailAddress,
        password,
        username,
        firstName,
        lastName,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    setIsLoading(true)
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/(tabs)')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  if (pendingVerification) {
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
              VERIFY YOUR EMAIL
            </Text>
          </View>

          <TextInput
            className="flex-row items-center justify-center bg-slate-50 border border-transparent rounded-full py-3 px-6 mb-8 min-w-[280px]"
            style={shadowStyle}
            value={code}
            placeholder="Enter your verification code"
            onChangeText={(code) => setCode(code)}
          />

          <TouchableOpacity
            className="flex-row items-center justify-center bg-blue-900 border border-transparent rounded-full py-3 px-6 mb-8 min-w-[280px]"
            onPress={onVerifyPress}
            disabled={isLoading}
            style={shadowStyle}
          >
            {isLoading && (
              <View className="absolute inset-0 items-center justify-center">
                <ActivityIndicator size="small" color="white" />
              </View>
            )}
            
            <View className={`flex-row items-center justify-center ${isLoading ? "opacity-0" : "opacity-100"}`}>
              <Text className="text-white font-medium text-base">Verify</Text>
            </View>
          </TouchableOpacity>

        </ImageBackground>
      </View>
    )
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
            SIGN UP
          </Text>
        </View>

        <TextInput
          className="flex-row items-center justify-center bg-slate-50 border border-transparent rounded-full py-3 px-6 mb-8 min-w-[280px]"
          style={shadowStyle}
          autoCapitalize="none"
          value={username}
          placeholder="Username"
          onChangeText={setUsername}
        />
        
        <TextInput
          className="flex-row items-center justify-center bg-slate-50 border border-transparent rounded-full py-3 px-6 mb-8 min-w-[280px]"
          style={shadowStyle}
          autoCapitalize="none"
          value={firstName}
          placeholder="First name"
          onChangeText={setFirstName}
        />
        
        <TextInput
          className="flex-row items-center justify-center bg-slate-50 border border-transparent rounded-full py-3 px-6 mb-8 min-w-[280px]"
          style={shadowStyle}
          autoCapitalize="none"
          value={lastName}
          placeholder="Last name"
          onChangeText={setLastName}
        />
        
        <TextInput
          className="flex-row items-center justify-center bg-slate-50 border border-transparent rounded-full py-3 px-6 mb-8 min-w-[280px]"
          style={shadowStyle}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={setEmailAddress}
        />
        
        <TextInput
          className="flex-row items-center justify-center bg-slate-50 border border-transparent rounded-full py-3 px-6 mb-8 min-w-[280px]"
          style={shadowStyle}
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          className="flex-row items-center justify-center bg-blue-900 border border-transparent rounded-full py-3 px-6 mb-8 min-w-[280px]"
          onPress={onSignUpPress}
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
            Already have an account? 
          </Text>
          <TouchableOpacity onPress={() => router.push('/sign-in')}>
            <Text className="text-blue-900 font-bold text-xs"> Sign in</Text>
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