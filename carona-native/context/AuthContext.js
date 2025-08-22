import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
