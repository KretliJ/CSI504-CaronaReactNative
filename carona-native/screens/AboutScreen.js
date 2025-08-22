import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

function SobreScreen({ navigation }) {
  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={styles.title}>Caronas mobile v1</Text>
        <Text
          style={{ fontSize: 10, position: "absolute", left: 25, bottom: 10 }}
        >
          -A student's project by Jonas Kretli
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Toque para voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
  },
  container: {
    backgroundColor: "#fef3c7",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  title: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    marginTop: 32,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 12,
    backgroundColor: "#e2e8f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "black",
  },
});

export default SobreScreen;
