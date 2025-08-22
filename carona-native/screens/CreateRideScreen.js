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
import { Ionicons } from "@expo/vector-icons";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const CreateRideScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [seats, setSeats] = useState("");
  const [price, setPrice] = useState("");

  const handleCreateRide = async () => {
    if (!from || !to || !date || !seats || !price) {
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
        price: parseFloat(price),
        driverId: user.email,
        driverName: user.name,
        passengers: [],
        status: "active",
        usersWhoRated: [],
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
      {/* 1. Added a dedicated header view */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Oferecer Carona</Text>
      </View>
      {/* 2. Wrapped the form in a ScrollView to center it */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
        <TextInput
          style={styles.input}
          placeholder="Preço (R$) - Digite 0 se gratuito"
          placeholderTextColor="#ccc"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateRide}
        >
          <Text style={styles.createButtonText}>Publicar Carona</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
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
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
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
  cancelButton: {
    backgroundColor: "#505050",
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default CreateRideScreen;
