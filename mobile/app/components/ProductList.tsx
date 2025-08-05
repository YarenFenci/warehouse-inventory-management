import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useUserStore } from '../components/user'; // store yolunu kendi dosya yapına göre değiştir
s
interface Product {
  id: number;
  name: string;
  barcode: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const getAuthHeaders = useUserStore((state) => state.getAuthHeaders);
  const fetchProducts = async () => {
    try {
      const headers = getAuthHeaders(); 
  
      const response = await fetch('http://192.168.8.139:8000/api/products', {
        method: 'GET',
        headers, // headers buraya direkt geç
      });
  
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Ürünler alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.barcode}>Barkod: {item.barcode}</Text>
    </View>
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  item: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  barcode: {
    fontSize: 14,
    color: '#555',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductList;
