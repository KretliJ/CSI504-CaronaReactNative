import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { db } from "../firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayRemove,
  increment,
  deleteDoc,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";

const RideDetailsScreen = ({ route, navigation }) => {
  const { rideId } = route.params;
  const { user } = useContext(AuthContext);
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, "Rides", rideId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setRide({ ...docSnap.data(), id: docSnap.id });
        } else {
          console.log("No such document!");
          Alert.alert("Erro", "Esta carona не foi encontrada.");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching ride details: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [rideId]);

  const handleCancelReservation = async () => {
    if (!user) return;
    try {
      const rideRef = doc(db, "Rides", ride.id);
      await updateDoc(rideRef, {
        seats: increment(1),
        passengers: arrayRemove(user.email),
      });
      Alert.alert("Sucesso", "Sua reserva foi cancelada.");
    } catch (error) {
      console.error("Error cancelling reservation: ", error);
      Alert.alert("Erro", "Não foi possível cancelar sua reserva.");
    }
  };

  const handleCompleteRide = async () => {
    try {
      const rideRef = doc(db, "Rides", ride.id);
      await updateDoc(rideRef, {
        status: "completed",
      });
      Alert.alert("Sucesso", "Carona marcada como concluída.");
    } catch (error) {
      console.error("Error completing ride: ", error);
      Alert.alert("Erro", "Não foi possível concluir a carona.");
    }
  };

  const handleDeleteRide = async () => {
    Alert.alert(
      "Deletar Carona",
      "Tem certeza que deseja deletar esta carona?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "Rides", ride.id));
              Alert.alert("Sucesso", "A carona foi deletada.");
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting ride: ", error);
              Alert.alert("Erro", "Não foi possível deletar a carona.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#e94560" style={styles.loader} />
    );
  }

  if (!ride) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.errorText}>Carona não encontrada.</Text>
      </View>
    );
  }

  const isDriver = user?.email === ride.driverId;
  const isPassenger = ride.passengers?.includes(user?.email);
  const isCompleted = ride.status === "completed";
  const hasUserRated = ride.usersWhoRated?.includes(user?.email);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
      <Text style={styles.title}>
        {ride.from} → {ride.to}
      </Text>

      {isCompleted && (isDriver || isPassenger) && !hasUserRated && (
        <TouchableOpacity
          style={styles.rateButton}
          onPress={() => navigation.navigate("Rating", { ride: ride })}
        >
          <Ionicons name="star-half-outline" size={24} color="#1a1a2e" />
          <Text style={styles.rateButtonText}>Avaliar Carona</Text>
        </TouchableOpacity>
      )}

      {(isDriver || isPassenger) && !isCompleted && (
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate("Chat", { rideId: ride.id })}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="white" />
          <Text style={styles.chatButtonText}>Abrir Chat da Carona</Text>
        </TouchableOpacity>
      )}

      <View style={styles.card}>
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Motorista:</Text>
          <Text style={styles.detailValue}>{ride.driverName}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Data e Hora:</Text>
          <Text style={styles.detailValue}>{ride.date}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Vagas restantes:</Text>
          <Text style={styles.detailValue}>{ride.seats}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text
            style={[
              styles.detailValue,
              isCompleted ? styles.completedText : styles.activeText,
            ]}
          >
            {isCompleted ? "Concluída" : "Ativa"}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.passengerTitle}>
          Passageiros ({ride.passengers?.length || 0})
        </Text>
        {ride.passengers && ride.passengers.length > 0 ? (
          <FlatList
            data={ride.passengers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.passengerItem}>- {item}</Text>
            )}
          />
        ) : (
          <Text style={styles.passengerItem}>Nenhum passageiro ainda.</Text>
        )}
      </View>

      {/* This button will now only appear if the user is a passenger AND the ride is not completed */}
      {isPassenger && !isDriver && !isCompleted && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelReservation}
        >
          <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
        </TouchableOpacity>
      )}

      {isDriver && (
        <View style={styles.driverActions}>
          {!isCompleted && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleCompleteRide}
            >
              <Text style={styles.buttonText}>Concluir Carona</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteRide}
          >
            <Text style={styles.buttonText}>Deletar Carona</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#1a1a2e",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 80,
    marginBottom: 20,
  },
  chatButton: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  chatButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  rateButton: {
    flexDirection: "row",
    backgroundColor: "#ffc107",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  rateButtonText: {
    color: "#1a1a2e",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    color: "#ccc",
    fontSize: 16,
  },
  detailValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  activeText: {
    color: "#28a745",
  },
  completedText: {
    color: "#6c757d",
  },
  passengerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  passengerItem: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
  },
  cancelButton: {
    backgroundColor: "#ffc107",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#1a1a2e",
    fontWeight: "bold",
    fontSize: 18,
  },
  driverActions: {
    marginTop: 10,
  },
  completeButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default RideDetailsScreen;
