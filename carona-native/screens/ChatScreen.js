import React, { useState, useCallback, useEffect, useContext } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const ChatScreen = ({ route, navigation }) => {
  const { rideId } = route.params;
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = collection(db, "Rides", rideId, "chats");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt?.toDate() || new Date(),
          user: data.user,
        };
      });
      setMessages(allMessages);
    });

    return () => unsubscribe();
  }, [rideId]);

  const onSend = useCallback(
    (messages = []) => {
      const { text } = messages[0];
      const messagesRef = collection(db, "Rides", rideId, "chats");

      // Manually construct user object with latest AuthContext to avoid issues with race conditions
      addDoc(messagesRef, {
        text,
        createdAt: serverTimestamp(),
        user: {
          _id: user.email,
          name: user.name || user.email, // Use the name from context, with a fallback to email
          avatar: user.photoURL || null,
        },
      });
    },
    [rideId, user]
  );

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#333",
          },
          right: {
            backgroundColor: "#e94560",
          },
        }}
        textStyle={{
          left: {
            color: "#fff",
          },
          right: {
            color: "#fff",
          },
        }}
      />
    );
  };

  const renderUsername = (props) => {
    if (props.currentMessage && props.currentMessage.user) {
      return (
        <Text style={styles.usernameText}>
          {props.currentMessage.user.name}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat da Carona</Text>
        <View style={{ width: 24 }} />
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user.email,
          name: user.name,
          avatar: user.photoURL || null,
        }}
        placeholder="Digite sua mensagem..."
        messagesContainerStyle={styles.messagesContainer}
        alwaysShowSend
        renderBubble={renderBubble}
        renderUsernameOnMessage={true}
        renderUsername={renderUsername}
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
  messagesContainer: {
    backgroundColor: "#1a1a2e",
  },
  usernameText: {
    color: "#ccc",
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 2,
  },
});

export default ChatScreen;
