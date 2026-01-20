import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Text, View, TouchableOpacity } from 'react-native'
import SignOutButton from '../components/SignOutButton'

export default function HomeScreen() {
  const { user } = useUser()
  const router = useRouter()
  
  return (
      
    <View className="flex-1 justify-center items-center items-center px-6 mb-6" >
      <SignedIn>
        <Text
          className="text-blue-900 font-semibold text-2xl leading-7 tracking-tight"
          style={{
              textShadowColor: 'rgba(0,0,0,0.35)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 4,
            }}>
            Hello {user?.emailAddresses[0].emailAddress}
            </Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
          <Text>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
          <Text>Sign up</Text>
        </TouchableOpacity>
      </SignedOut>
    </View>
  )
}