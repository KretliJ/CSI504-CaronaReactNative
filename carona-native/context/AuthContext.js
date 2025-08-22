import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unsubscribe, setUnsubscribe] = useState(null);

  const login = async (userData) => {
    setIsLoading(true);
    setUser(userData);
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (e) {
      console.log("Failed to save user to storage", e);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    if (unsubscribe) {
      unsubscribe();
    }
    setUser(null);
    try {
      await AsyncStorage.removeItem("user");
    } catch (e) {
      console.log("Failed to remove user from storage", e);
    }
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (e) {
      console.log("Failed to fetch user from storage", e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  useEffect(() => {
    if (user && user.email) {
      const userDocRef = doc(db, "Users", user.email);
      const unsub = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setUser((prevUser) => ({
            ...prevUser,
            ...data,
            name: data.name || data.email,
          }));
        }
      });
      setUnsubscribe(() => unsub);
    } else {
      if (unsubscribe) {
        unsubscribe();
      }
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.email]);
  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
