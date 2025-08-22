import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const RideHistoryScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [historyRides, setHistoryRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const driverQuery = query(
      collection(db, "Rides"),
      where("driverId", "==", user.email)
    );

    const passengerQuery = query(
      collection(db, "Rides"),
      where("passengers", "array-contains", user.email)
    );

    const unsubscribeDriver = onSnapshot(
      driverQuery,
      (driverSnapshot) => {
        const ridesMap = new Map();
        driverSnapshot.forEach((doc) => {
          ridesMap.set(doc.id, { ...doc.data(), id: doc.id });
        });

        const unsubscribePassenger = onSnapshot(
          passengerQuery,
          (passengerSnapshot) => {
            passengerSnapshot.forEach((doc) => {
              ridesMap.set(doc.id, { ...doc.data(), id: doc.id });
            });

            const combinedRides = Array.from(ridesMap.values());
            setHistoryRides(combinedRides);
            setLoading(false);
          }
        );

        return () => unsubscribePassenger();
      },
      (error) => {
        console.error("Error fetching driver history: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribeDriver();
  }, [user]);

  const renderRideItem = ({ item }) => {
    const isCompleted = item.status === "completed";
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("RideDetails", { rideId: item.id })}
      >
        <View style={styles.rideCard}>
          <Text style={styles.rideRoute}>
            {item.from} → {item.to}
          </Text>
          <Text style={styles.rideInfo}>Data: {item.date}</Text>
          <View
            style={[
              styles.statusBadge,
              isCompleted ? styles.inactiveBadge : styles.activeBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {isCompleted ? "Finalizada" : "Ativa"}
            </Text>
          </View>
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
        <Text style={styles.headerTitle}>Histórico de Caronas</Text>
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#e94560"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={historyRides}
          renderItem={renderRideItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Você ainda не participou de nenhuma carona.
            </Text>
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
  emptyText: {
    color: "white",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: "#28a745",
  },
  inactiveBadge: {
    backgroundColor: "#6c757d",
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default RideHistoryScreen;
