import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const CreateRideScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [seats, setSeats] = useState("");

  const handleCreateRide = async () => {
    if (!from || !to || !date || !seats) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    if (!user) {
      Alert.alert("Erro", "Você precisa estar logado para criar uma carona.");
      return;
    }

    try {
      await addDoc(collection(db, "Rides"), {
        from: from,
        to: to,
        date: date,
        seats: parseInt(seats),
        driverId: user.email,
        driverName: user.name,
      });

      Alert.alert("Sucesso", "Carona criada com sucesso!");
      navigation.navigate("Rides");
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Erro", "Não foi possível criar a carona. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oferecer uma Carona</Text>
      <TextInput
        style={styles.input}
        placeholder="Saindo de..."
        placeholderTextColor="#ccc"
        value={from}
        onChangeText={setFrom}
      />
      <TextInput
        style={styles.input}
        placeholder="Indo para..."
        placeholderTextColor="#ccc"
        value={to}
        onChangeText={setTo}
      />
      <TextInput
        style={styles.input}
        placeholder="Data e Hora (ex: 25/12 08:00)"
        placeholderTextColor="#ccc"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Vagas disponíveis"
        placeholderTextColor="#ccc"
        value={seats}
        onChangeText={setSeats}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.createButton} onPress={handleCreateRide}>
        <Text style={styles.createButtonText}>Publicar Carona</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.gobackbutton}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#0f0c29",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "white",
    fontSize: 16,
    marginBottom: 15,
  },
  createButton: {
    backgroundColor: "#e94560",
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  gobackbutton: {
    backgroundColor: "#505050",
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    color: "white",
    textAlign: "center",
    fontWeight: 700,
    fontSize: 18,
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default CreateRideScreen;
