import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [profileUser, setProfileUser] = useState(user);
  const [myRides, setMyRides] = useState([]);
  const [takenRides, setTakenRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadLocalProfilePic = async () => {
      try {
        const savedPhotoUri = await AsyncStorage.getItem(
          `profile_image_${user.email}`
        );
        if (savedPhotoUri) {
          setProfileUser((prevUser) => ({
            ...prevUser,
            photoURL: savedPhotoUri,
          }));
        }
      } catch (e) {
        console.error("Failed to load profile picture from local storage.", e);
      }
    };
    loadLocalProfilePic();

    const offeredRidesQuery = query(
      collection(db, "Rides"),
      where("driverId", "==", user.email)
    );
    const unsubscribeOffered = onSnapshot(
      offeredRidesQuery,
      (querySnapshot) => {
        const ridesData = [];
        querySnapshot.forEach((doc) => {
          ridesData.push({ ...doc.data(), id: doc.id });
        });
        setMyRides(ridesData);
        setLoading(false);
      }
    );

    const takenRidesQuery = query(
      collection(db, "Rides"),
      where("passengers", "array-contains", user.email)
    );
    const unsubscribeTaken = onSnapshot(takenRidesQuery, (querySnapshot) => {
      const ridesData = [];
      querySnapshot.forEach((doc) => {
        ridesData.push({ ...doc.data(), id: doc.id });
      });
      setTakenRides(ridesData);
    });

    return () => {
      unsubscribeOffered();
      unsubscribeTaken();
    };
  }, [user]);

  const handleImagePick = async () => {
    console.log("Opening image picker...");
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Desculpe",
        "Precisamos de permissão para acessar suas fotos."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const source = { uri: result.assets[0].uri };
      try {
        await AsyncStorage.setItem(`profile_image_${user.email}`, source.uri);
        setProfileUser((prevUser) => ({ ...prevUser, photoURL: source.uri }));
      } catch (e) {
        console.error("Failed to save profile picture to local storage.", e);
        Alert.alert("Erro", "Não foi possível salvar a imagem de perfil.");
      }
    }
  };

  const renderRideItem = ({ item }) => {
    const isActive = item.status !== "completed";
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
          <View
            style={[
              styles.statusBadge,
              isActive ? styles.activeBadge : styles.inactiveBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {isActive ? "Ativa" : "Finalizada"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!profileUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhum usuário logado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Rides")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        ListHeaderComponent={
          <>
            <TouchableOpacity
              onPress={handleImagePick}
              style={styles.profileImageContainer}
            >
              <>
                {profileUser.photoURL ? (
                  <Image
                    source={{ uri: profileUser.photoURL }}
                    style={styles.profileImage}
                  />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={120}
                    color="#e94560"
                  />
                )}
                <View style={styles.editIconContainer}>
                  <Ionicons name="camera-outline" size={20} color="white" />
                </View>
              </>
            </TouchableOpacity>
            <Text style={styles.userName}>{profileUser.name}</Text>
            <Text style={styles.userInfo}>{profileUser.email}</Text>
            <Text style={styles.userInfo}>Perfil: {profileUser.role}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{myRides.length}</Text>
                <Text style={styles.statLabel}>Caronas Oferecidas</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{takenRides.length}</Text>
                <Text style={styles.statLabel}>Caronas Pegas</Text>
              </View>
            </View>
            <Text style={styles.sectionTitle}>Minhas Caronas Oferecidas</Text>
          </>
        }
        data={myRides}
        renderItem={renderRideItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#e94560" />
          ) : (
            <Text style={styles.emptyText}>
              Você ainda não ofereceu nenhuma carona.
            </Text>
          )
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Deslogar</Text>
          </TouchableOpacity>
        }
        contentContainerStyle={styles.listContentContainer}
      />
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
  listContentContainer: {
    padding: 20,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#e94560",
    borderRadius: 15,
    padding: 5,
    pointerEvents: "none", // This ensures the touch passes through to the parent
  },
  userName: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  userInfo: {
    color: "#ccc",
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 30,
    marginBottom: 20,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    color: "#e94560",
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    color: "white",
    fontSize: 14,
    marginTop: 5,
  },
  sectionTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    width: "100%",
  },
  rideCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: "100%",
  },
  rideRoute: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  rideInfo: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 5,
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
  emptyText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: "#e94560",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 40,
    alignSelf: "center",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  errorText: {
    color: "white",
    fontSize: 18,
  },
});

export default UserProfileScreen;
