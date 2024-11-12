import { View, Text, StyleSheet, Button, Modal } from 'react-native'
import React, { useState } from 'react'
import Input from '@/components/Input'
import { SafeAreaView } from 'react-native-safe-area-context'
import { scale } from 'react-native-size-matters'
import ButtonCustom from '@/components/Button'
import { router, useRouter } from 'expo-router'
import { isNil } from '@/utils/utils'
import axios from 'axios'
import { API_BASE_URL } from '@/config/api'
import { useSignUp } from '@clerk/clerk-expo'
const Signup = () => {

    const [nameValue, setNameValue] = useState("")
    const [usernameValue, setUsernameValue] = useState("")
    const [emailValue, setEmailValue] = useState("")
    const [passwordValue, setPasswordValue] = useState("")
    const [error, setError] = useState(false)
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()
    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')

    const onSignUpPress = async () => {
        if (!isLoaded) {
            return
        }

        try {
            await signUp.create({
                username: usernameValue,
                emailAddress: emailValue,
                password: passwordValue,
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            setPendingVerification(true)
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    const onPressVerify = async () => {
        if (!isLoaded) {
            return
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            })

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId })
                router.replace('/')
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2))
            }
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    return (
        <SafeAreaView className="h-full w-full">
            <View className="flex-1 justify-center items-start h-full w-fulL p-8">
                <Text className="text-3xl font-bold text-white mb-8">Sign Up To Artifonia</Text>
                <Input label="Name" onChangeText={(text: string) => setNameValue(text)} value={nameValue} stylesView={styles.inputContainer} stylesLabel={styles.inputLabel} stylesInput={styles.input} />
                <Input label="Email" onChangeText={(text: string) => setEmailValue(text)} value={emailValue} stylesView={styles.inputContainer} stylesLabel={styles.inputLabel} stylesInput={styles.input} />
                <Input label="Username" onChangeText={(text: string) => setUsernameValue(text)} value={usernameValue} stylesView={styles.inputContainer} stylesLabel={styles.inputLabel} stylesInput={styles.input} />
                <Input label="Password" onChangeText={(text: string) => setPasswordValue(text)} value={passwordValue} stylesView={styles.inputContainer} stylesLabel={styles.inputLabel} stylesInput={styles.input} />
                <View className="flex-row justify-center items-center w-full gap-8">
                    <ButtonCustom title="Signup" onPress={() => onSignUpPress()} stylesTouchable={styles.button} stylesText={styles.buttonText} />
                    <ButtonCustom title="Login" onPress={() => router.push("/login")} stylesTouchable={styles.button} stylesText={styles.buttonText} />
                </View>
                <Modal visible={error} transparent={true} animationType="fade">
                    <View className="flex-1 justify-center items-center bg-white ">
                        <Text className="text-black text-2xl font-bold">Tutti i campi sono obbligatori</Text>
                    </View>
                </Modal>
            </View>
            <Modal visible={pendingVerification} transparent={true} animationType="fade">
                <Input label="Code" value={code} onChangeText={(code: string) => setCode(code)} stylesView={styles.inputContainer} stylesLabel={styles.inputLabel} stylesInput={styles.input} />
                <ButtonCustom title="Verify Email" onPress={() => onPressVerify()} stylesTouchable={styles.button} stylesText={styles.buttonText} />
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        width: "100%",
        backgroundColor: "white",
        padding: scale(10),
        borderRadius: scale(10),
        marginBottom: scale(10),
        flexDirection: "row",
        alignContent: "center",
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
        backgroundColor: "blue",
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

export default Signup