import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const ButtonCustom = ({ title, onPress, stylesTouchable, stylesText }) => {
  return (
    <TouchableOpacity style={stylesTouchable} className="bg-blue-500 rounded-md" onPress={onPress}>
        <Text className="text-white text-center text-base" style={{stylesText}}>{title}</Text>
    </TouchableOpacity>
  )
}

export default ButtonCustom