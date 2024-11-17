import { View, Text, StyleSheet, Modal, Alert } from 'react-native'
import React, { useState } from 'react'
import Input from '@/components/Input'
import { SafeAreaView } from 'react-native-safe-area-context'
import { scale } from 'react-native-size-matters'
import ButtonCustom from '@/components/Button'
import { useRouter } from 'expo-router'
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
                firstName: nameValue,
            })

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            setPendingVerification(true)
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
            Alert.alert("Error", err.errors[0].message);
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
            Alert.alert("Error", err.errors[0].message);
        }
    }

    return (
        <SafeAreaView className="h-full w-full">
            {pendingVerification ?
                <Modal visible={pendingVerification} transparent={true} animationType="fade" className='w-full h-full justify-center items-center'>
                    <Input label="Code" value={code} onChangeText={(code: string) => setCode(code)} stylesView={styles.inputContainer} stylesLabel={styles.inputLabel} stylesInput={styles.input} />
                    <ButtonCustom title="Verify Email" onPress={() => onPressVerify()} stylesTouchable={styles.button} stylesText={styles.buttonText} />
                </Modal> :
                <View className="flex-1 justify-center items-center h-full w-full p-8">
                    {/* <Image source={logoArtifonia} className="w-28 h-28 mb-8" /> */}
                    <View className="w-full">
                        <Text className="text-3xl font-bold text-white mb-8 text-center">Sign Up To Artifonia</Text>
                        <Input label="Name" onChangeText={(text: string) => setNameValue(text)} value={nameValue} stylesView={styles.inputContainer} stylesLabel={styles.inputLabel} stylesInput={styles.input} />
                        <Input label="Email" onChangeText={(text: string) => setEmailValue(text)} value={emailValue} stylesView={styles.inputContainer} stylesLabel={styles.inputLabel} stylesInput={styles.input} />
                        <Input label="Username" onChangeText={(text: string) => setUsernameValue(text)} value={usernameValue} stylesView={styles.inputContainer} stylesLabel={styles.inputLabel} stylesInput={styles.input} />
                        <Input label="Password" onChangeText={(text: string) => setPasswordValue(text)} value={passwordValue} stylesView={styles.inputContainer} stylesLabel={styles.inputLabel} stylesInput={styles.input} />
                        <View className="flex-row justify-center items-center w-full gap-8">
                            <ButtonCustom title="Signup" onPress={() => onSignUpPress()} stylesTouchable={styles.button} stylesText={styles.buttonText} />
                            <ButtonCustom title="Login" onPress={() => router.push("/login")} stylesTouchable={styles.button} stylesText={styles.buttonText} />
                        </View>
                    </View>
                </View>
            }
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

export default Signup