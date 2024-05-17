import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../screens/signedIn/config/constants";

const Divider = () => {
  return React.createElement(View, { style: styles.div }, null);
};

const styles = StyleSheet.create({
  div: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.secondaryColorAlt,
    marginStart: 60,
  },
});

export default Divider;
