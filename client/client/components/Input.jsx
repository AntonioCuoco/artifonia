import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useState } from 'react'

const Input = ({ label, onChangeText, value, stylesView, stylesLabel, stylesInput }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    // <View style={stylesView}>
    //   <Text style={stylesLabel}>{label}</Text>
    //   <TextInput style={stylesInput} value={value} onChange={onChange} />
    // </View>
    <>
      <Text style={stylesLabel}>{label}</Text>
      <View style={stylesView}>
        <TextInput
          style={stylesInput}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={label === "Password" && !showPassword}
        />
        {label === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="top-1">
            {!showPassword ? <FontAwesome6 name="eye" size={22} color="black" /> : <FontAwesome6 name="eye-slash" size={22} color="black" />}
          </TouchableOpacity>
        )}
      </View>
    </>
  )
}

export default Input