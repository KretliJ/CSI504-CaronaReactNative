import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../firebase";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  increment,
  where,
} from "firebase/firestore";

const RidesScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "Rides"),
      where("status", "!=", "completed")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const ridesData = [];
        querySnapshot.forEach((doc) => {
          ridesData.push({
            ...doc.data(),
            id: doc.id,
            passengers: doc.data().passengers || [],
          });
        });
        setRides(ridesData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching rides: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleReservation = async (ride) => {
    if (!user) {
      Alert.alert("Erro", "Você precisa estar logado para reservar.");
      return;
    }
    if (ride.driverId === user.email) {
      Alert.alert("Aviso", "Você не pode reservar sua própria carona.");
      return;
    }
    if (ride.passengers.includes(user.email)) {
      Alert.alert("Aviso", "Você já reservou um lugar nesta carona.");
      return;
    }
    if (ride.seats <= 0) {
      Alert.alert("Aviso", "Esta carona não tem mais vagas disponíveis.");
      return;
    }

    try {
      const rideRef = doc(db, "Rides", ride.id);
      await updateDoc(rideRef, {
        seats: increment(-1),
        passengers: arrayUnion(user.email),
      });
      Alert.alert("Sucesso!", "Sua vaga foi reservada.");
    } catch (error) {
      console.error("Error reserving ride: ", error);
      Alert.alert(
        "Erro",
        "Não foi possível completar a reserva. Tente novamente."
      );
    }
  };

  const renderRideItem = ({ item }) => {
    const isDriver = user?.email === item.driverId;
    const isFull = item.seats <= 0;
    const isAlreadyReserved = item.passengers.includes(user?.email);

    let buttonText = "Reservar";
    let buttonDisabled = false;
    let buttonStyle = styles.reserveButton;

    if (isDriver) {
      buttonText = "Sua Carona";
      buttonDisabled = true;
      buttonStyle = [styles.reserveButton, styles.disabledButton];
    } else if (isFull && !isAlreadyReserved) {
      buttonText = "Lotado";
      buttonDisabled = true;
      buttonStyle = [styles.reserveButton, styles.disabledButton];
    } else if (isAlreadyReserved) {
      buttonText = "Reservado";
      buttonDisabled = true;
      buttonStyle = [styles.reserveButton, styles.reservedButton];
    }

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("RideDetails", { rideId: item.id })}
      >
        <View style={styles.rideCard}>
          <Text style={styles.rideRoute}>
            {item.from} → {item.to}
          </Text>
          <Text style={styles.rideInfo}>
            Horário: {item.date} | Vagas: {item.seats}
          </Text>
          <Text style={styles.rideDriver}>Motorista: {item.driverName}</Text>
          <TouchableOpacity
            style={buttonStyle}
            disabled={buttonDisabled}
            onPress={() => handleReservation(item)}
          >
            <Text style={styles.reserveButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Caronas Disponíveis</Text>
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#e94560"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={rides}
          renderItem={renderRideItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhuma carona disponível no momento.
            </Text>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#e94560"
            />
          }
        />
      )}
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
  list: {
    padding: 20,
  },
  rideCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  rideRoute: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  rideInfo: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 5,
  },
  rideDriver: {
    color: "#e94560",
    fontSize: 14,
    marginTop: 5,
    fontStyle: "italic",
  },
  reserveButton: {
    backgroundColor: "#e94560",
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 15,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#555",
  },
  reservedButton: {
    backgroundColor: "#28a745",
  },
  reserveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyText: {
    color: "white",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});

export default RidesScreen;
