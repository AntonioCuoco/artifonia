import { View, Text } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'
import { SignedIn, SignedOut } from '@clerk/clerk-expo'

const index = () => {
  return (
    // <Redirect href="/(routes)/onboarding" />
    // <Redirect href="/(auth)/login" />
    <View>
      <SignedIn>
        <Redirect href="/(routes)/onboarding" />
      </SignedIn>
      <SignedOut>
        <Redirect href="/(auth)/login" />
      </SignedOut>
    </View>
  )
}

export default index