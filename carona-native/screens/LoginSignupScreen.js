import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";

import SHA256 from "crypto-js/sha256";
import { db } from "../firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
const user_ico = require("../assets/person.png");
const email_ico = require("../assets/email.png");
const password_ico = require("../assets/password.png");

const hashPassword = (password) => {
  return SHA256(password).toString();
};

const verifyPassword = (inputPassword, storedHash) => {
  const reHashedInput = hashPassword(inputPassword);
  return reHashedInput === storedHash;
};

const LoginSignup = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [action, setAction] = useState("Cadastrar");
  const [userType, setUserType] = useState(null);

  const resetAllFields = () => {
    setUser("");
    setEmail("");
    setPassword("");
    setCPassword("");
  };

  const handleRegister = async () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@(aluno\.)?ufop\.[a-zA-Z]{2,}/;
    if (!emailRegex.test(email.toLowerCase())) {
      Alert.alert("Erro", "Por favor, use um e-mail institucional da UFOP.");
      return;
    }
    if (!user || !email || !password || !cPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    if (!userType) {
      Alert.alert(
        "Erro",
        "Por favor, selecione um tipo de perfil (Motorista, Passageiro ou Ambos)."
      );
      return;
    }
    if (password !== cPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const userDocRef = doc(db, "Users", email.toLowerCase());
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        Alert.alert("Erro", "Este e-mail já está cadastrado.");
        return;
      }

      const hashedPassword = hashPassword(password);

      await setDoc(userDocRef, {
        name: user,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: userType,
      });

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      resetAllFields();
      setAction("Entrar");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao tentar fazer o cadastro. Tente novamente."
      );
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha o e-mail e a senha.");
      return;
    }

    try {
      const userDocRef = doc(db, "Users", email.toLowerCase());
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        Alert.alert(
          "Erro no Login",
          "Usuário não encontrado. Verifique seu e-mail."
        );
        return;
      }

      const userData = userDoc.data();
      const isPasswordCorrect = verifyPassword(password, userData.password);

      if (isPasswordCorrect) {
        login(userData);
        Alert.alert("Sucesso", `Bem-vindo(a) de volta, ${userData.name}!`);
      } else {
        Alert.alert(
          "Erro no Login",
          "Senha incorreta. Por favor, tente novamente."
        );
      }
    } catch (error) {
      console.error("Erro no login:", error);
      Alert.alert("Erro", "Ocorreu um erro ao tentar fazer o login.");
    }
  };

  const handleSubmit = () => {
    if (action === "Cadastrar") {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.containerLogin}>
          <View style={styles.headerLogin}>
            <Text style={styles.text}>{action}</Text>
            <View style={styles.underline} />
          </View>

          <View style={styles.inputs}>
            {action === "Cadastrar" && (
              <View style={styles.inputLogin}>
                <Image source={user_ico} style={styles.icon} />
                <TextInput
                  style={styles.inputField}
                  placeholder="Digite seu nome de usuário"
                  placeholderTextColor="#ccc"
                  value={user}
                  onChangeText={setUser}
                />
              </View>
            )}

            <View style={styles.inputLogin}>
              <Image source={email_ico} style={styles.icon} />
              <TextInput
                style={styles.inputField}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#ccc"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputLogin}>
              <Image source={password_ico} style={styles.icon} />
              <TextInput
                style={styles.inputField}
                placeholder="Digite sua senha"
                placeholderTextColor="#ccc"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {action === "Cadastrar" && (
              <View style={styles.inputLogin}>
                <Image source={password_ico} style={styles.icon} />
                <TextInput
                  style={styles.inputField}
                  placeholder="Confirme sua senha"
                  placeholderTextColor="#ccc"
                  value={cPassword}
                  onChangeText={setCPassword}
                  secureTextEntry
                />
              </View>
            )}
          </View>

          {action === "Cadastrar" && (
            <View style={styles.userTypeContainer}>
              <Text style={styles.userTypeTitle}>Eu sou:</Text>
              <View style={styles.userTypeOptions}>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    userType === "Motorista" && styles.userTypeButtonActive,
                  ]}
                  onPress={() => setUserType("Motorista")}
                >
                  <Text
                    style={[
                      styles.userTypeButtonText,
                      userType === "Motorista" &&
                        styles.userTypeButtonTextActive,
                    ]}
                  >
                    Motorista
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    userType === "Passageiro" && styles.userTypeButtonActive,
                  ]}
                  onPress={() => setUserType("Passageiro")}
                >
                  <Text
                    style={[
                      styles.userTypeButtonText,
                      userType === "Passageiro" &&
                        styles.userTypeButtonTextActive,
                    ]}
                  >
                    Passageiro
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    userType === "Ambos" && styles.userTypeButtonActive,
                  ]}
                  onPress={() => setUserType("Ambos")}
                >
                  <Text
                    style={[
                      styles.userTypeButtonText,
                      userType === "Ambos" && styles.userTypeButtonTextActive,
                    ]}
                  >
                    Ambos
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {action === "Entrar" && (
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
            </TouchableOpacity>
          )}

          <View style={styles.submitContainer}>
            <TouchableOpacity
              style={[styles.submitLogin, action === "Entrar" && styles.gray]}
              onPress={() => {
                setAction("Cadastrar");
                resetAllFields();
              }}
            >
              <Text style={styles.submitText}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitLogin,
                action === "Cadastrar" && styles.gray,
              ]}
              onPress={() => {
                setAction("Entrar");
                resetAllFields();
              }}
            >
              <Text style={styles.submitText}>Entrar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.mainButton} onPress={handleSubmit}>
            <Text style={styles.mainButtonText}>
              {action === "Cadastrar"
                ? "Confirmar Cadastro"
                : "Clique para Entrar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  containerLogin: {
    width: "90%",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    alignItems: "center",
  },
  headerLogin: {
    alignItems: "center",
    gap: 9,
    width: "100%",
    marginBottom: 20,
  },
  text: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
  },
  underline: {
    width: 61,
    height: 6,
    backgroundColor: "#e94560",
    borderRadius: 9,
  },
  inputs: {
    marginTop: 20,
    width: "100%",
    gap: 15,
  },
  inputLogin: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#0f0c29",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 15,
    tintColor: "#e94560",
  },
  inputField: {
    flex: 1,
    height: "100%",
    color: "white",
    fontSize: 16,
  },
  forgotPassword: {
    marginTop: 15,
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  submitContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
    marginTop: 30,
    justifyContent: "center",
  },
  submitLogin: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: 50,
    backgroundColor: "#0f0c29",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#e94560",
  },
  submitText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  gray: {
    backgroundColor: "transparent",
    borderColor: "#555",
  },
  mainButton: {
    marginTop: 20,
    width: "100%",
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e94560",
    justifyContent: "center",
    alignItems: "center",
  },
  mainButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 20,
    left: 10,
    padding: 10,
    zIndex: 1,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
  userTypeContainer: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
  userTypeTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  userTypeOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  userTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e94560",
  },
  userTypeButtonActive: {
    backgroundColor: "#e94560",
  },
  userTypeButtonText: {
    color: "white",
    fontSize: 14,
  },
  userTypeButtonTextActive: {
    color: "#1a1a2e",
    fontWeight: "bold",
  },
});

export default LoginSignup;
