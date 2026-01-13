import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Text, View, TouchableOpacity } from 'react-native'
import SignOutButton from '../components/SignOutButton'

export default function Page() {
  const { user } = useUser()
  const router = useRouter()

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
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