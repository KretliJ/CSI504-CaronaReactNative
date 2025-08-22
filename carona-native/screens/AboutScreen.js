import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AboutScreen = ({ navigation }) => {
  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sobre o App</Text>
      </View>

      <View style={styles.content}>
        <Ionicons name="car-sport-outline" size={80} color="#e94560" />
        <Text style={styles.title}>Caronas UFOP</Text>
        <Text style={styles.version}>Iteração 3.9.2</Text>

        <Text style={styles.description}>
          Este é um projeto de estudante desenvolvido para facilitar a
          organização de caronas para a comunidade da Universidade Federal de
          Ouro Preto.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Desenvolvido por:</Text>
          <Text style={styles.cardText}>Jonas Kretli</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tecnologias Utilizadas:</Text>
          <Text style={styles.cardText}>React Native, Expo & Firebase</Text>
        </View>

        <TouchableOpacity
          style={styles.githubButton}
          onPress={() =>
            openLink("https://github.com/KretliJ/CSI504-CaronaReactNative")
          }
        >
          <Ionicons name="logo-github" size={24} color="white" />
          <Text style={styles.githubButtonText}>Ver no GitHub</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#0f0c29",
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
  },
  version: {
    color: "#e94560",
    fontSize: 16,
    marginBottom: 20,
  },
  description: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    marginBottom: 15,
    alignItems: "center",
  },
  cardTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  cardText: {
    color: "#e94560",
    fontSize: 16,
    marginTop: 5,
  },
  githubButton: {
    flexDirection: "row",
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  githubButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default AboutScreen;
