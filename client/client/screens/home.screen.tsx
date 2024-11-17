import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { scale, verticalScale } from "react-native-size-matters";
import OpenAI from "openai";
import Input from "@/components/Input";
import ButtonCustom from "@/components/Button";
import InputWithoutLabel from "@/components/InputWithoutLabel";
import { isNil } from "@/utils/utils";

export default function HomeScreen() {
  const openai = new OpenAI({ apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY });
  const [prompt, setPrompt] = useState("");
  const heightStatusBar = StatusBar.currentHeight ? StatusBar.currentHeight + scale(20) : scale(25);
  const [imageUrl, setImageUrl] = useState("");

  const handleOpenAiImageGeneration = async () => {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "a white siamese cat",
      n: 1,
      size: "1024x1024",
    });
    console.log(response.data[0].url);
    setImageUrl(response.data[0].url || "");
  }

  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === 'android' || Platform.OS === 'ios' ? heightStatusBar : 0 }} className="flex-1">
      <LinearGradient
        colors={["#250152", "#000"]}      //colors={["#250152", "#000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <StatusBar barStyle={"light-content"} />

       { /* back shadows */}
        {/* <Image
          source={require("@/assets/main/blur.png")}
          style={{
            position: "absolute",
            right: scale(-15),
            top: 0,
            width: scale(240),
          }}
        />
        <Image
          source={require("@/assets/main/purple-blur.png")}
          style={{
            position: "absolute",
            left: scale(-15),
            bottom: verticalScale(100),
            width: scale(210),
          }}
        /> */}

        <View className="flex-1 w-full h-full items-start justify-start p-4 gap-8">
          <View className="w-full">
            <InputWithoutLabel label="Insert a Prompt" onPressButton={() => handleOpenAiImageGeneration()} onChangeText={(text: string) => setPrompt(text)} value={prompt} stylesView={styles.inputContainer} stylesLabel={styles.inputLabel} stylesInput={styles.input} stylesButton={styles.button} stylesButtonText={styles.buttonText} />
          </View>
          
          {isNil(imageUrl) ? null : <Image source={{ uri: imageUrl }} />}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
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
      padding: scale(22),
      flexDirection: "row",
      alignContent: "flex-start",
      justifyContent: "center"
  },
  inputLabel: {
      // color: "white",
      // fontSize: scale(16),
      // fontWeight: "bold",
      // marginBottom: scale(8),
      // textAlign: "left"
  },
  input: {
      width: "100%",
      height: scale(45),
      fontSize: scale(16),
      color: "#000",
      padding: scale(12),
      backgroundColor: "white",
  },
  button: {
      width: "15.7%",
      height: scale(45),
      backgroundColor: "#7D82B8",
      padding: scale(11),
      alignItems: "center",
      justifyContent: "center"
  },
  buttonText: {
      color: "white",
      textAlign: "center",
      fontWeight: "bold"
  }
})

