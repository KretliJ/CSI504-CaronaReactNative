import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { ActivityIndicator, View } from "react-native";

// Import all screens
import LoginSignupScreen from "./screens/LoginSignupScreen";
import RidesScreen from "./screens/RidesScreen";
import CreateRideScreen from "./screens/CreateRideScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import AboutScreen from "./screens/AboutScreen";
import RideDetailsScreen from "./screens/RideDetailsScreen";
import RideHistoryScreen from "./screens/RideHistoryScreen";
import ReportPage from "./screens/ReportPage";
import AdministratorPage from "./screens/AdministratorPage";
import ChatScreen from "./screens/ChatScreen";
import RatingScreen from "./screens/RatingScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#0f0c29",
        },
        drawerInactiveTintColor: "white",
        drawerActiveTintColor: "#e94560",
        drawerActiveBackgroundColor: "rgba(233, 69, 96, 0.1)",
      }}
    >
      <Drawer.Screen
        name="Rides"
        component={RidesScreen}
        options={{ title: "Caronas Disponíveis" }}
      />
      <Drawer.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{ title: "Meu Perfil" }}
      />
      <Drawer.Screen
        name="History"
        component={RideHistoryScreen}
        options={{ title: "Histórico" }}
      />
      <Drawer.Screen
        name="Report"
        component={ReportPage}
        options={{ title: "Relatar Problema" }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{ title: "Sobre" }}
      />
      {user?.role === "Motorista" || user?.role === "Ambos" ? (
        <Drawer.Screen
          name="CreateRide"
          component={CreateRideScreen}
          options={{ title: "Oferecer Carona" }}
        />
      ) : null}
      {user?.role === "Admin" ? (
        <Drawer.Screen
          name="Admin"
          component={AdministratorPage}
          options={{ title: "Página do Administrador" }}
        />
      ) : null}
      <Drawer.Screen
        name="RideDetails"
        component={RideDetailsScreen}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="Rating"
        component={RatingScreen}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#1a1a2e",
        }}
      >
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <DrawerNavigator />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoginSignup" component={LoginSignupScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
