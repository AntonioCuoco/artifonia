import { View, Text, StyleSheet, Button, Modal, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import Input from '@/components/Input'
import { SafeAreaView } from 'react-native-safe-area-context'
import { scale } from 'react-native-size-matters'
import ButtonCustom from '@/components/Button'
import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Image } from 'react-native'
import logoArtifonia from '@/assets/images/logoArtifonia.png'
// import { FontAwesome } from '@expo/vector-icons'

const Login = () => {
    const [emailValue, setEmailValue] = useState("")
    const [passwordValue, setPasswordValue] = useState("")
    const [error, setError] = useState(false)
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const onSignInPress = React.useCallback(async () => {
        if (!isLoaded) {
            return
        }

        try {
            const signInAttempt = await signIn.create({
                identifier: emailValue,
                password: passwordValue,
            })

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                // See https://clerk.com/docs/custom-flows/error-handling
                // for more info on error handling
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
            Alert.alert("Error", err.errors[0].message);
        }
    }, [isLoaded, emailValue, passwordValue])

    return (
        <SafeAreaView className="h-full w-full">
            <View className="flex-1 justify-center items-center h-full w-full p-8">
                <Image source={logoArtifonia} className="w-28 h-28 mb-8" />
                <View className="w-full">
                    <Text className="text-3xl font-bold text-white mb-8 text-center">Login To Artifonia</Text>
                    <Input label="Email" onChangeText={(text: string) => setEmailValue(text)} value={emailValue} stylesView={styles.inputContainer} stylesLabel={styles.inputLabel} stylesInput={styles.input} />
                    <Input label="Password" onChangeText={(text: string) => setPasswordValue(text)} value={passwordValue} stylesView={styles.inputContainer} stylesLabel={styles.inputLabel} stylesInput={styles.input} />
                    <View className="flex-row justify-center items-center w-full gap-8">
                        <ButtonCustom title="Login" onPress={() => onSignInPress()} stylesTouchable={styles.button} stylesText={styles.buttonText} />
                        <ButtonCustom title="Signup" onPress={() => router.push("/signup")} stylesTouchable={styles.button} stylesText={styles.buttonText} />
                    </View>
                </View>
                {/* <View style={styles.container}>
                        <FontAwesome.Button name="google" backgroundColor="#4285F4" style={{ fontFamily: "Roboto" }} onPress={() => signInWithGoogle()}>
                            Login with Google
                        </FontAwesome.Button>
                    </View> */}
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scale(16),
        width: "100%",
    },
    inputContainer: {
        width: "100%",
        backgroundColor: "white",
        padding: scale(10),
        borderRadius: scale(10),
        marginBottom: scale(10),
        flexDirection: "row",
        alignContent: "flex-end",
        justifyContent: "center"
    },
    inputLabel: {
        color: "white",
        fontSize: scale(16),
        fontWeight: "bold",
        marginBottom: scale(8),
        textAlign: "left"
    },
    input: {
        width: "100%",
        flex: 1
    },
    button: {
        width: "45%",
        backgroundColor: "#7D82B8",
        padding: scale(12),
        borderRadius: scale(10),
        marginTop: scale(12),
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold"
    }
})

export default Login