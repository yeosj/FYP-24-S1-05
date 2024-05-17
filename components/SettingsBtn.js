import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from "../config/constants";

const SettingsBtn = ({title, icon, iconColor, iconBgColor, onPress}) => {
    return React.createElement(
        TouchableOpacity,
        {style: styles.btn, onPress: onPress},
        React.createElement(
            View,
            {style: [styles.iconContainer, {backgroundColor: iconBgColor}]},
            React.createElement(Ionicons, {name: icon, size: 24, color: iconColor})
        ),
        React.createElement(Text, {style: styles.title}, title),
        React.createElement(Ionicons, {name: "chevron-forward-outline", size: 20, color: colors.secondaryColorAlt})
    );
}

const styles = StyleSheet.create({
    btn: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: colors.secondaryColor,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: colors.primaryTextColor,
        marginStart: 16,
        flex: 1
    }
})

export default SettingsBtn;
