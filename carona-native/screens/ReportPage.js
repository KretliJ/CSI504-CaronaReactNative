import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const ReportPage = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [reportText, setReportText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReport = async () => {
    if (reportText.trim().length < 10) {
      Alert.alert(
        "Erro",
        "Por favor, forneça mais detalhes no seu relato (mínimo 10 caracteres)."
      );
      return;
    }
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "Reports"), {
        reporterEmail: user.email,
        reporterName: user.name,
        reportText: reportText,
        createdAt: serverTimestamp(),
        status: "new",
      });

      Alert.alert(
        "Sucesso",
        "Seu relato foi enviado com sucesso. Agradecemos a sua colaboração."
      );
      setReportText("");
      navigation.navigate("Rides");
    } catch (error) {
      console.error("Error submitting report: ", error);
      Alert.alert(
        "Erro",
        "Não foi possível enviar o seu relato. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relatar um Problema</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.instructions}>
          Descreva o problema que você encontrou. Inclua o máximo de detalhes
          possível, como nomes, datas e o que aconteceu. Sua identidade será
          mantida em sigilo.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu relato aqui..."
          placeholderTextColor="#ccc"
          multiline
          value={reportText}
          onChangeText={setReportText}
        />
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmitReport}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Enviando..." : "Enviar Relato"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContainer: {
    padding: 20,
  },
  instructions: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    color: "white",
    fontSize: 16,
    height: 200,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#e94560",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#555",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default ReportPage;
