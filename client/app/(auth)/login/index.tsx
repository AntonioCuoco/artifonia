import { View, Text, StyleSheet, Button, Modal, TextInput } from 'react-native'
import React, { useState } from 'react'
import Input from '@/components/Input'
import { SafeAreaView } from 'react-native-safe-area-context'
import { scale } from 'react-native-size-matters'
import ButtonCustom from '@/components/Button'
import { router } from 'expo-router'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, googleAuthProvider } from '@/firebase/firebase'
import axios from 'axios'
import { FontAwesome } from '@expo/vector-icons'
import { isNil } from '@/utils/utils'
import { API_BASE_URL } from '@/config/api'
import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
// import { FontAwesome } from '@expo/vector-icons'

const Login = () => {
    const [emailValue, setEmailValue] = useState("")
    const [passwordValue, setPasswordValue] = useState("")
    const [error, setError] = useState(false)
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()


    // const handleOnPressButton = async () => {
    //     try {
    //         if (isNil(emailValue) || isNil(passwordValue)) {
    //             return alert('Tutti i campi sono obbligatori');
    //         }

    //         console.log('Tentativo di connessione a:', `${API_BASE_URL}/login`); // Debug URL

    //         const response = await axios.post(`${API_BASE_URL}/login`, {
    //             email: emailValue,
    //             password: passwordValue
    //         }, {
    //             timeout: 5000, // timeout dopo 5 secondi
    //         });

    //         console.log('Risposta:', response.data); // Debug risposta

    //         if (response.data.error) {
    //             return alert(response.data.error);
    //         }

    //         //creare componente modale
    //         //aggiungere parte creazione jwt token e salvataggio token in async storage
    //         router.push('/');
    //         console.log('Navigazione a:', '/');
    //     } catch (error) {
    //         console.error('Errore dettagliato:', error); // Log completo dell'errore

    //         if (axios.isAxiosError(error)) {
    //             if (error.code === 'ECONNABORTED') {
    //                 alert('Timeout della richiesta. Verifica la tua connessione.');
    //             } else if (error.response) {
    //                 // Il server ha risposto con un codice di errore
    //                 alert(`Errore del server: ${error.response.status} - ${error.response.data?.message || 'Errore sconosciuto'}`);
    //             } else if (error.request) {
    //                 // La richiesta è stata fatta ma non è stata ricevuta risposta
    //                 alert('Impossibile raggiungere il server. Verifica che il server sia in esecuzione e l\'URL sia corretto.');
    //             } else {
    //                 alert('Errore di rete: ' + error.message);
    //             }
    //         } else {
    //             alert('Si è verificato un errore imprevisto');
    //         }
    //     }
    // }

    // const signInWithGoogle = async () => {
    //     try {
    //         const result = await signInWithPopup(auth, googleAuthProvider);

    //         const credential = GoogleAuthProvider.credentialFromResult(result);
    //         const token = credential?.accessToken;
    //         const user = result.user;

    //         console.log("dati da google:", result, credential, token, user);

    //         if (isNil(user.email) || isNil(user.displayName) || isNil(user.photoURL)) {
    //             throw new Error('Informazioni utente mancanti dal profilo Google');
    //         }

    //         const googleUser = {
    //             name: user.displayName?.split(' ')[0] || '',
    //             surname: user.displayName?.split(' ').slice(1).join(' ') || '',
    //             email: user.email,
    //             photo: user.photoURL,
    //         }

    //         console.log("googleUser:", googleUser);

    //         try {
    //             await axios.post(`${API_BASE_URL}/saveGoogleUser`, googleUser);
    //             router.push('/');
    //         } catch (axiosError) {
    //             if (axios.isAxiosError(axiosError)) {
    //                 if (axiosError.response?.status === 409) {
    //                     // Utente già esistente, procedi con il login
    //                     console.log('Utente Google già registrato, procedendo con il login');
    //                     return router.push('/');
    //                 }
    //                 throw new Error(`Errore server: ${axiosError.response?.data?.message || 'Errore sconosciuto'}`);
    //             }
    //             throw axiosError;
    //         }

    //     } catch (error) {
    //         console.error('Errore durante il login con Google:', error);

    //         if (error instanceof Error) {
    //             switch (error.message) {
    //                 case 'auth/popup-closed-by-user':
    //                     alert('Login annullato: hai chiuso la finestra di login');
    //                     break;
    //                 case 'auth/popup-blocked':
    //                     alert('Il popup è stato bloccato dal browser. Abilita i popup per continuare');
    //                     break;
    //                 case 'auth/cancelled-popup-request':
    //                     alert('Troppe richieste di popup. Riprova');
    //                     break;
    //                 case 'auth/network-request-failed':
    //                     alert('Errore di rete. Verifica la tua connessione internet');
    //                     break;
    //                 case 'Informazioni utente mancanti dal profilo Google':
    //                     alert('Impossibile recuperare le informazioni dal profilo Google');
    //                     break;
    //                 default:
    //                     alert(`Si è verificato un errore durante il login: ${error.message}`);
    //             }
    //         } else {
    //             alert('Si è verificato un errore imprevisto durante il login');
    //         }
    //     }
    // }

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
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
        }
    }, [isLoaded, emailValue, passwordValue])

    return (
        <SafeAreaView className="h-full w-full">
            <View className="flex-1 justify-center items-start h-full w-full p-8">
                <Text className="text-3xl font-bold text-white mb-8 text-center">Login To Artifonia</Text>
                <Input label="Email" onChangeText={(text: string) => setEmailValue(text)} value={emailValue} stylesView={styles.inputContainer} stylesLabel={styles.inputLabel} stylesInput={styles.input} />
                <Input label="Password" onChangeText={(text: string) => setPasswordValue(text)} value={passwordValue} stylesView={styles.inputContainer} stylesLabel={styles.inputLabel} stylesInput={styles.input} />
                <View className="flex-row justify-center items-center w-full gap-8">
                    <ButtonCustom title="Login" onPress={() => onSignInPress()} stylesTouchable={styles.button} stylesText={styles.buttonText} />
                    <ButtonCustom title="Signup" onPress={() => router.push("/signup")} stylesTouchable={styles.button} stylesText={styles.buttonText} />
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

export default Login