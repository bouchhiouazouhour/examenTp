import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { api } from "../utils/api";
import { storage } from "../utils/storage";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { useAuth } from "../utils/AuthContext";


export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Champs manquants",
        text2: "Veuillez remplir tous les champs",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      
      if (success) {
        Toast.show({
          type: "success",
          text1: "Connexion réussie",
        });
        router.replace("/home");
      } else {
        Toast.show({
          type: "error",
          text1: "Erreur de connexion",
          text2: "Email ou mot de passe incorrect",
        });
      }
    } catch (err: any) {
      console.error("Login error:", err);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Une erreur est survenue lors de la connexion",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("admin@familydo.tn");
    setPassword("admin");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FamilyDo</Text>
      
      <Text style={styles.label}>Email :</Text>
      <TextInput
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="admin@familydo.tn"
      />

      <Text style={styles.label}>Mot de passe :</Text>
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholder="admin"
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.button, isLoading && styles.buttonDisabled]}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Connexion..." : "Se connecter"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={fillDemoCredentials}
        style={styles.demoButton}
      >
        <Text style={styles.demoButtonText}>Remplir avec le compte démo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: "center",
    backgroundColor: "#f5f5f5"
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#4CAF50"
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "white"
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10
  },
  buttonDisabled: {
    backgroundColor: "#a5d6a7"
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600"
  },
  demoButton: {
    padding: 15,
    alignItems: "center",
    marginTop: 20
  },
  demoButtonText: {
    color: "#2196F3",
    fontSize: 14
  }
});