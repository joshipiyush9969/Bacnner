import { StatusBar } from "expo-status-bar";
import { Dimensions, StyleSheet, Text, View,Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";

//navigator
import AppNav from "./navigator/AppNav";




export default function App() {
console.disableYellowBox = true;

  return (
    <AppNav/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
