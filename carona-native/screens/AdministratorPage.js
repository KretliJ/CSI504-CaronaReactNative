import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

const AdministratorPage = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query to get all reports that are not marked as 'closed'
    const q = query(collection(db, "Reports"), where("status", "!=", "closed"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reportsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          // Convert Firestore Timestamp to a readable date string
          createdAt:
            doc.data().createdAt?.toDate().toLocaleDateString("pt-BR") ||
            "Data indisponível",
        }));
        setReports(reportsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching reports: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleCloseReport = async (reportId) => {
    Alert.alert(
      "Fechar Relato",
      "Tem certeza que deseja marcar este relato como resolvido?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          style: "destructive",
          onPress: async () => {
            try {
              const reportRef = doc(db, "Reports", reportId);
              await updateDoc(reportRef, {
                status: "closed",
              });
            } catch (error) {
              console.error("Error closing report: ", error);
              Alert.alert("Erro", "Não foi possível fechar o relato.");
            }
          },
        },
      ]
    );
  };

  const renderReportItem = ({ item }) => (
    <View style={styles.reportCard}>
      <Text style={styles.reporterInfo}>De: {item.reporterEmail}</Text>
      <Text style={styles.reportDate}>Data: {item.createdAt}</Text>
      <Text style={styles.reportText}>{item.reportText}</Text>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => handleCloseReport(item.id)}
      >
        <Text style={styles.closeButtonText}>Marcar como Resolvido</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Painel do Administrador</Text>
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#e94560"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReportItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Text style={styles.listHeader}>Relatos Abertos</Text>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhum relato aberto no momento.
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
  listHeader: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reportCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  reporterInfo: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  reportDate: {
    color: "#ccc",
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 10,
  },
  reportText: {
    color: "#eee",
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 15,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyText: {
    color: "white",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});

export default AdministratorPage;
