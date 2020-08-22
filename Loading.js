import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

function Loading() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Getting the fuckin weather</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFAA5",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text: {
    color: "#2c2c2c",
    fontSize: 30,
  },
});

export default Loading;
