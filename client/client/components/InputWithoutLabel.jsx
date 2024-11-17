import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useState } from 'react'
import ButtonCustom from './Button';
import { scale } from 'react-native-size-matters';

const InputWithoutLabel = ({ label, onPressButton, onChangeText, value, stylesView, stylesLabel, stylesInput, stylesButton, stylesButtonText }) => {
  return (
    // <View style={stylesView}>
    //   <Text style={stylesLabel}>{label}</Text>
    //   <TextInput style={stylesInput} value={value} onChange={onChange} />
    // </View>
    <>
      <View style={stylesView}>
        <TextInput
          style={stylesInput}
          value={value}
          onChangeText={onChangeText}
          editable={true}
          placeholder={label}
        />
        <TouchableOpacity onPress={onPressButton} style={stylesButton}>
          <FontAwesome6 name="arrow-right" size={22} color="black" />
        </TouchableOpacity>
      </View>
    </>
  )
}

export default InputWithoutLabel