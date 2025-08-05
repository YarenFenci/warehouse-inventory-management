import React from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { Snackbar, Button as PaperButton } from "react-native-paper";

export default function RegisterScreen() {
  const { control, handleSubmit } = useForm();
  const router = useRouter();
  const [snackbar, setSnackbar] = React.useState("");
  const API_URL = "http://192.168.8.139:8000/api/register";
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const resData = await response.json();
      if (response.ok) {
        setSnackbar("Registration successful!");
        setTimeout(() => router.replace("/login"), 1000);
      } else {
        setSnackbar(resData.message || "Registration failed!");
      }
    } catch (error) {
      setSnackbar("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Controller
        control={control}
        name="email"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      <PaperButton
        mode="contained"
        buttonColor="#43a047"
        style={{ marginBottom: 8 }}
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={loading}
      >
        Register
      </PaperButton>
      <PaperButton
        mode="outlined"
        buttonColor="#1976d2"
        onPress={() => router.replace("/login")}
        style={{ marginBottom: 8 }}
      >
        Back to Login
      </PaperButton>
      <Text style={styles.demoInfo}>
        Demo Client: client@example.com / 1234
      </Text>
      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar("")}
        duration={1500}
        style={{ backgroundColor: "#43a047" }}
      >
        {snackbar}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  demoInfo: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
    color: "#666",
  },
});
