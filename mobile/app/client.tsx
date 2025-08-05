import React from "react";
import { View, Text, FlatList, StyleSheet, TextInput } from "react-native";
import {
  Snackbar,
  Modal,
  Portal,
  Provider as PaperProvider,
  Card,
  Avatar,
  Button as PaperButton,
} from "react-native-paper";
import { useProductStore } from "../store/products";
import { useRouter } from "expo-router";
import { useUserStore } from "./components/user";

function ExchangeRates() {
  // Demo: Sabit döviz kurları
  return (
    <Card style={styles.exchangeCard}>
      <Card.Title
        title="Exchange Rates"
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon="currency-usd"
            color="#fff"
            style={{ backgroundColor: "#1976d2" }}
          />
        )}
      />
      <Card.Content>
        <Text style={styles.exchangeText}>USD/TRY: 32.50</Text>
        <Text style={styles.exchangeText}>EUR/TRY: 35.20</Text>
      </Card.Content>
    </Card>
  );
}

export default function ClientScreen() {
  const { products } = useProductStore();
  const router = useRouter();
  const { isLoggedIn, token } = useUserStore();

  React.useEffect(() => {
    if (!isLoggedIn || !token) {
      router.replace("/login");
    }
  }, [isLoggedIn, token]);

  const API_URL = "http://192.168.8.139:8000/api/products";
  const [modalVisible, setModalVisible] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState("");
  const [addLoading, setAddLoading] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", barcode: "", stock: "" });
  const [productsState, setProductsState] = React.useState(products);

  const handleAddProduct = async () => {
    if (!form.name || !form.barcode || !form.stock) {
      setSnackbar("Tüm alanları doldurun!");
      return;
    }
    setAddLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          barcode: form.barcode,
          stock: Number(form.stock),
          unit_id: 1, // örnek sabit değer
        }),
      });
      const resData = await response.json();
      if (response.ok) {
        setSnackbar("Ürün başarıyla eklendi!");
        setProductsState([...productsState, { ...resData, stock: form.stock }]);
        setModalVisible(false);
        setForm({ name: "", barcode: "", stock: "" });
      } else {
        setSnackbar(resData.message || "Ürün eklenemedi!");
      }
    } catch (error) {
      setSnackbar("Sunucuya bağlanılamadı.");
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.bg}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Product Stock</Text>
          <PaperButton
            mode="contained"
            icon="home"
            buttonColor="#ffb300"
            textColor="#fff"
            style={styles.homeBtn}
            onPress={() => router.replace("/login")}
          >
            Home
          </PaperButton>
        </View>
        <ExchangeRates />
        <PaperButton
          mode="contained"
          icon="plus"
          buttonColor="#1976d2"
          style={{ marginBottom: 12, borderRadius: 8 }}
          onPress={() => setModalVisible(true)}
        >
          Ürün Ekle
        </PaperButton>
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={{
              backgroundColor: "#fff",
              padding: 24,
              margin: 24,
              borderRadius: 16,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 16,
                color: "#1976d2",
              }}
            >
              Yeni Ürün Ekle
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ürün Adı"
              value={form.name}
              onChangeText={(text) => setForm((f) => ({ ...f, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Barkod"
              value={form.barcode}
              onChangeText={(text) => setForm((f) => ({ ...f, barcode: text }))}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Stok"
              value={form.stock}
              onChangeText={(text) => setForm((f) => ({ ...f, stock: text }))}
              keyboardType="numeric"
            />
            <PaperButton
              mode="contained"
              buttonColor="#43a047"
              style={{ marginTop: 12, borderRadius: 8 }}
              onPress={handleAddProduct}
              loading={addLoading}
              disabled={addLoading}
            >
              Kaydet
            </PaperButton>
          </Modal>
        </Portal>
        <Snackbar
          visible={!!snackbar}
          onDismiss={() => setSnackbar("")}
          duration={2000}
          style={{
            backgroundColor: snackbar.includes("başarı")
              ? "#43a047"
              : "#d32f2f",
            borderRadius: 8,
          }}
        >
          {snackbar}
        </Snackbar>
        <FlatList
          data={productsState}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 32 }}
          renderItem={({ item }) => (
            <Card style={styles.productCard}>
              <Card.Title
                title={item.name}
                left={(props) => (
                  <Avatar.Icon
                    {...props}
                    icon="cube"
                    color="#fff"
                    style={{ backgroundColor: "#43a047" }}
                  />
                )}
              />
              <Card.Content style={styles.cardContent}>
                <Text style={styles.productStock}>Stock: {item.stock}</Text>
              </Card.Content>
            </Card>
          )}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#e8f5e9",
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  homeBtn: {
    borderRadius: 8,
    marginLeft: 8,
    elevation: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#43a047",
    marginBottom: 8,
    textAlign: "left",
    letterSpacing: 1,
  },
  exchangeCard: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 6,
  },
  exchangeText: {
    fontSize: 18,
    color: "#1976d2",
    fontWeight: "bold",
    marginBottom: 4,
  },
  productCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#43a047",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  productStock: {
    fontSize: 18,
    color: "#1976d2",
    fontWeight: "bold",
    flex: 1,
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
});
