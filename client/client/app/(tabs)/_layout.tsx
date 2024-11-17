import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';
import { Feather, FontAwesome } from '@expo/vector-icons';

const HomeLayout = () => {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="index" options={{
                title: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <FontAwesome name="home" size={size} color={color} />
                ),
            }} />
            <Tabs.Screen name="profile/index" options={{
                title: 'Profile',
                tabBarIcon: ({ color, size }) => (
                    <Feather name="user" size={size} color={color} />
                ),
            }} />
        </Tabs>
    )
}

export default HomeLayout 