import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import {
  Snackbar,
  Button as PaperButton,
  Card,
  Avatar,
} from "react-native-paper";
import { useUserStore } from '../store/user';

function ExchangeRates() {
  return (
    <Card style={styles.exchangeCard}>
      <Card.Content style={{ alignItems: "center", paddingVertical: 12 }}>
        <Avatar.Icon
          size={48}
          icon="currency-usd"
          color="#fff"
          style={{ backgroundColor: "#1976d2", marginBottom: 8 }}
        />
        <Text style={styles.exchangeTitle}>Exchange Rates</Text>
        <View style={styles.ratesRow}>
          <View style={styles.rateBox}>
            <Text style={styles.currencyCode}>USD/TRY</Text>
            <Text style={styles.currencyValue}>32.50</Text>
          </View>
          <View style={styles.rateBox}>
            <Text style={styles.currencyCode}>EUR/TRY</Text>
            <Text style={styles.currencyValue}>35.20</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

export default function LoginScreen() {
  const { control, handleSubmit } = useForm();
  const router = useRouter();

  // useUserStore'dan gerekli fonksiyonları tek seferde alıyoruz
  const login = useUserStore((s) => s.login);
  const setToken = useUserStore((s) => s.setToken);
  const setUserInfo = useUserStore((s) => s.setUserInfo);

  const [role, setRole] = useState<"admin" | "client" | null>(null);
  const [snackbar, setSnackbar] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://192.168.8.139:8000/api/login";

  const onAdminLogin = async (data: any) => {
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

      if (response.ok && resData.user?.role?.name === "admin") {
        login("admin");
        setToken(resData.token);
        setUserInfo({
          id: resData.user.id,
          name: resData.user.name,
          email: resData.user.email,
          role: resData.user.role.name,
          roleId: resData.user.role.id,
        });
        setSnackbar(`Welcome, ${resData.user.name}!`);
        setTimeout(() => router.replace("/admin"), 800);
      } else {
        setSnackbar(resData.message || "Admin girişi reddedildi");
      }
    } catch (error) {
      setSnackbar("Sunucuya bağlanılamadı.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Client login fonksiyonunu email/şifre ile giriş yapacak şekilde değiştiriyorum
  const onClientLogin = async (data: any) => {
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
      if (response.ok && resData.user?.role?.name === "client") {
        login("client");
        setToken(resData.token);
        setUserInfo({
          id: resData.user.id,
          name: resData.user.name,
          email: resData.user.email,
          role: resData.user.role.name,
          roleId: resData.user.role.id,
        });
        setSnackbar(`Welcome, ${resData.user.name}!`);
        setTimeout(() => router.replace("/client"), 800);
      } else {
        setSnackbar(resData.message || "Client girişi reddedildi");
      }
    } catch (error) {
      setSnackbar("Sunucuya bağlanılamadı.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.bg}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <ExchangeRates />
          <Text style={styles.title}>Stock Management</Text>
          <View style={styles.roleRow}>
            <View
              style={[
                styles.roleBtn,
                role === "admin" && styles.selectedRole,
                {
                  backgroundColor: "#1976d2",
                  shadowColor: "#000",
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                },
              ]}
              onTouchEnd={() => setRole("admin")}
            >
              <Avatar.Icon
                size={48}
                icon="account-cog"
                color="#fff"
                style={{ backgroundColor: "transparent" }}
              />
              <Text style={styles.roleText}>Admin</Text>
            </View>
            <View
              style={[
                styles.roleBtn,
                role === "client" && styles.selectedRole,
                {
                  backgroundColor: "#43a047",
                  shadowColor: "#000",
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                },
              ]}
              onTouchEnd={() => setRole("client")}
            >
              <Avatar.Icon
                size={48}
                icon="account"
                color="#fff"
                style={{ backgroundColor: "transparent" }}
              />
              <Text style={styles.roleText}>Client</Text>
            </View>
          </View>

          {role === "admin" && (
            <Card style={styles.formCard}>
              <Card.Title
                title="Admin Login"
                left={(props) => <Avatar.Icon {...props} icon="lock" />}
              />
              <Card.Content>
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
                  buttonColor="#1976d2"
                  style={styles.loginBtn}
                  onPress={handleSubmit(onAdminLogin)}
                  icon="login"
                  loading={loading}
                  disabled={loading}
                >
                  Login as Admin
                </PaperButton>
              </Card.Content>
            </Card>
          )}

          {role === "client" && (
            <Card style={styles.formCard}>
              <Card.Title
                title="Client Login"
                left={(props) => <Avatar.Icon {...props} icon="account" />}
              />
              <Card.Content>
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
                  style={styles.loginBtn}
                  onPress={handleSubmit(onClientLogin)}
                  icon="login"
                  loading={loading}
                  disabled={loading}
                >
                  Login as Client
                </PaperButton>
              </Card.Content>
            </Card>
          )}

          <Snackbar
            visible={!!snackbar}
            onDismiss={() => setSnackbar("")}
            duration={2000}
            style={{
              backgroundColor: snackbar.includes("Welcome")
                ? "#43a047"
                : "#d32f2f",
              borderRadius: 8,
            }}
          >
            {snackbar}
          </Snackbar>

          <PaperButton
            mode="text"
            onPress={() => router.push("/register")}
            style={{ marginTop: 8 }}
          >
            Register
          </PaperButton>
          <PaperButton
            mode="text"
            onPress={() => router.push("/forgot-password")}
            style={{ marginTop: 16 }}
          >
            Forgot Password?
          </PaperButton>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#e3f2fd" },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  exchangeCard: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: "#f5faff",
    elevation: 8,
    borderWidth: 1,
    borderColor: "#e3e3e3",
    shadowColor: "#1976d2",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  exchangeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 8,
    letterSpacing: 1,
  },
  ratesRow: {
    flexDirection: "row",
    gap: 24,
    justifyContent: "center",
    marginTop: 4,
  },
  rateBox: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#1976d2",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginHorizontal: 4,
  },
  currencyCode: {
    fontSize: 16,
    color: "#888",
    fontWeight: "600",
    marginBottom: 2,
  },
  currencyValue: {
    fontSize: 22,
    color: "#1976d2",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#1976d2",
    letterSpacing: 1,
  },
  roleRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 32,
  },
  roleBtn: {
    width: 120,
    height: 120,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  selectedRole: {
    borderColor: "#ffb300",
    borderWidth: 3,
    elevation: 8,
    shadowOpacity: 0.3,
  },
  roleText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 8,
  },
  formCard: {
    width: 320,
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 6,
    shadowColor: "#1976d2",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  input: {
    borderWidth: 1,
    borderColor: "#bdbdbd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f5f5f5",
  },
  loginBtn: {
    marginTop: 8,
    borderRadius: 8,
    elevation: 2,
  },
});
