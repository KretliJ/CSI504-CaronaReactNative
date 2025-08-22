import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";

const RatingScreen = ({ route, navigation }) => {
  const { ride } = route.params;
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDriver = user.email === ride.driverId;
  const personToRate = isDriver ? ride.passengers[0] : ride.driverId;

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert(
        "Avaliação Incompleta",
        "Por favor, selecione pelo menos uma estrela."
      );
      return;
    }
    setIsSubmitting(true);

    try {
      const userToRateRef = doc(db, "Users", personToRate);
      await updateDoc(userToRateRef, {
        totalStars: increment(rating),
        ratingCount: increment(1),
      });
      const rideRef = doc(db, "Rides", ride.id);
      await updateDoc(rideRef, {
        usersWhoRated: arrayUnion(user.email),
      });

      Alert.alert("Obrigado!", "Sua avaliação foi enviada com sucesso.");
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting rating: ", error);
      Alert.alert("Erro", "Não foi possível enviar sua avaliação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = () => (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={40}
            color="#e94560"
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Avaliar Carona</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.infoText}>
          Avalie sua experiência com {isDriver ? "o passageiro" : "o motorista"}
          .
        </Text>
        <StarRating />
        <TextInput
          style={styles.input}
          placeholder="Deixe um comentário (opcional)..."
          placeholderTextColor="#ccc"
          multiline
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmitRating}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>Enviar Avaliação</Text>
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
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#0f0c29",
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  infoText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    color: "white",
    fontSize: 16,
    height: 100,
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

export default RatingScreen;
