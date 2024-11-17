import { View, Text, SafeAreaView, Button, Image, Platform, StatusBar, StyleSheet, Alert } from 'react-native'
import { useUser, useClerk } from '@clerk/clerk-expo'
import ButtonCustom from '@/components/Button';
import { scale } from 'react-native-size-matters';
import { router } from 'expo-router';


const index = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const heightStatusBar = StatusBar.currentHeight ? StatusBar.currentHeight + scale(20) : scale(25);

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Conferma Cancellazione",
      "Sei sicuro di voler cancellare il tuo account?",
      [
        {
          text: "Annulla",
          style: "cancel"
        },
        {
          text: "Conferma",
          onPress: async () => {
            try {
              await user?.delete();
              Alert.alert("Successo", "Account cancellato con successo.");
              router.replace("/");
              // Potresti voler reindirizzare l'utente o eseguire altre azioni qui
            } catch (error) {
              console.error("Errore durante la cancellazione dell'account:", error);
              Alert.alert("Errore", "Si è verificato un errore durante la cancellazione dell'account.");
            }
          }
        }
      ]
    );
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' || Platform.OS === 'ios' ? heightStatusBar : 0 }} className='justify-start items-center bg-black'>
      <StatusBar barStyle='light-content' backgroundColor='transparent' />
      <Image source={{ uri: user?.imageUrl }} className='w-20 h-20 rounded-full p-2' />
      <Text className='text-white text-2xl font-bold pt-4 pb-2'>{user?.username}</Text>
      <Text className='text-white'>{user?.emailAddresses[0].emailAddress}</Text>
      <ButtonCustom title='Edit Profile' onPress={() => { }} stylesTouchable={styles.editButton} stylesText={styles.buttonText} />
      <View className='flex-column justify-center items-start w-full gap-4 p-4'>
        <Text className='text-white'>Settings:</Text>
        <ButtonCustom title='Change Password' onPress={() => {}} stylesTouchable={styles.firstButton} stylesText={styles.buttonText} />
        <ButtonCustom title='Sign Out' onPress={() => handleSignOut()} stylesTouchable={styles.button} stylesText={styles.buttonText} />
        <ButtonCustom title='Delete Account' onPress={() => handleDeleteAccount()} stylesTouchable={styles.button} stylesText={styles.buttonText} />
      </View>
      {/* <SignOutButton><Text className='text-black bg-white p-2 rounded-md mt-4'>Sign Out</Text></SignOutButton> */}
    </SafeAreaView>
  )
}

{/* Colori Buoni: #883677,#8B5FBF,#6A6B83,#848FA5,#758BFD,#2A4494*/}

const styles = StyleSheet.create({
  editButton: {
    width: "45%",
    backgroundColor: "#7B4B94" ,
    padding: scale(12),
    borderRadius: scale(10),
    marginTop: scale(16),
  },
  firstButton: {
    width: "100%",
    backgroundColor: "#7D82B8",
    padding: scale(12),
    borderRadius: scale(10),
  },
  button: {
    width: "100%",
    backgroundColor: "#7D82B8",
    padding: scale(12),
    borderRadius: scale(10),
    // marginTop: scale(16),
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  },
})

export default index