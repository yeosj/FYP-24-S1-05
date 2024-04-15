import React, { useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // You can use any icon library

const CustomCheckBox = ({ value, onValueChange }) => {
  return (
    <TouchableOpacity onPress={() => onValueChange(!value)}>
      <FontAwesome
        name={value ? "check-square" : "square-o"}
        size={20}
        color={value ? "green" : "black"}
      />
    </TouchableOpacity>
  );
};

export default CustomCheckBox;
