import { Redirect } from "expo-router";
import { useAuth } from "../utils/AuthContext";
import { View, Text, ActivityIndicator } from "react-native";

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10 }}>Chargement...</Text>
      </View>
    );
  }

  // Rediriger vers la page appropriée
  if (user) {
    return <Redirect href="/home" />;
  } else {
    return <Redirect href="/login" />;
  }
}