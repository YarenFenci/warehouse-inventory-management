import React, { useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Alert, Modal, Pressable, TextInputProps } from 'react-native';
import { useProductStore } from '../store/products';
import { Snackbar, Button as PaperButton, Card, Avatar, IconButton, SegmentedButtons } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useUserStore } from '../store/user';

interface Product {
  id: string;
  name: string;
  stock: number;
  category: string;
  brand: string;
  warehouse: string;
  barcode?: string;
  history?: Array<{
    type: 'in' | 'out';
    amount: number;
    date: string;
  }>;
}

export default function AdminScreen() {
  const { products, addProduct, updateStock, categories, brands, warehouses } = useProductStore();
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [barcode, setBarcode] = useState('');
  const [snackbar, setSnackbar] = useState('');
  const [tab, setTab] = useState<'add' | 'manage'>('add');
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const token = useUserStore((s) => s.token);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        updateStock(id, 0); // Demo: Silmek yerine stoğu sıfırla
        setSnackbar('Product removed!');
      }},
    ]);
  };

  const onAddProduct = async () => {
    if (!name || !stock || !barcode) {
      setSnackbar('Please fill all fields!');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://192.168.8.139:8000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          barcode,
          unit_id: parseInt(stock),
        }),
      });
      const resData = await response.json();
      if (response.ok) {
        setSnackbar('Product added!');
        setName('');
        setStock('');
        setBarcode('');
      } else {
        setSnackbar(resData.message || 'Failed to add product');
      }
    } catch (error) {
      setSnackbar('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = (productId: string, newStockText: string) => {
    const newStock = parseInt(newStockText);
    if (!isNaN(newStock) && newStock >= 0) {
      updateStock(productId, newStock);
      setSnackbar('Stock updated successfully!');
      if (newStock < 5) {
        setTimeout(() => setSnackbar('Warning: Stock is critically low!'), 1000);
      }
    } else {
      setSnackbar('Please enter a valid stock number!');
    }
  };

  return (
    <View style={styles.bg}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Admin Panel</Text>
        <PaperButton 
          mode="contained" 
          icon="home" 
          buttonColor="#ffb300" 
          textColor="#fff" 
          style={styles.homeBtn} 
          onPress={() => router.replace('/login')}
        >
          Home
        </PaperButton>
      </View>
      
      <View style={styles.reportsRow}>
        <PaperButton 
          mode="contained" 
          icon="file-chart" 
          buttonColor="#43a047" 
          textColor="#fff" 
          style={styles.reportsBtn} 
          onPress={() => router.push('/reports')}
        >
          Reports
        </PaperButton>
      </View>

      <SegmentedButtons
        value={tab}
        onValueChange={(value) => setTab(value as 'add' | 'manage')}
        buttons={[
          { 
            value: 'add', 
            label: 'Add Product', 
            icon: 'plus-box',
            style: { 
              backgroundColor: tab === 'add' ? '#1976d2' : '#fff'
            }
          },
          { 
            value: 'manage', 
            label: 'Manage Products', 
            icon: 'cube',
            style: { 
              backgroundColor: tab === 'manage' ? '#43a047' : '#fff'
            }
          },
        ]}
        style={styles.tabs}
      />

      {tab === 'add' && (
        <Card style={styles.formCard}>
          <Card.Title 
            title="Add Product" 
            left={(props) => (
              <Avatar.Icon 
                {...props} 
                icon="plus-box" 
                color="#fff" 
                style={{ backgroundColor: '#1976d2' }} 
              />
            )} 
          />
          <Card.Content>
            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Barcode"
              value={barcode}
              onChangeText={setBarcode}
            />
            <TextInput
              style={styles.input}
              placeholder="Stock"
              value={stock}
              onChangeText={setStock}
              keyboardType="numeric"
            />
            <PaperButton
              mode="contained"
              buttonColor="#1976d2"
              style={styles.addBtn}
              onPress={onAddProduct}
              loading={loading}
              disabled={loading}
              icon="plus"
            >
              Add Product
            </PaperButton>
          </Card.Content>
        </Card>
      )}

      {tab === 'manage' && (
        <>
          <Text style={styles.subtitle}>Current Stock ({products.length} products)</Text>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => {
              const stockInputRef = useRef<TextInput>(null);
              
              return (
                <Pressable onPress={() => setSelectedProduct(item)}>
                  <Card style={styles.productCard}>
                    <Card.Title
                      title={item.name}
                      left={(props) => (
                        <Avatar.Icon 
                          {...props} 
                          icon="cube" 
                          color="#fff" 
                          style={{ backgroundColor: '#43a047' }} 
                        />
                      )}
                      right={(props) => (
                        <View style={styles.cardActions}>
                          {item.stock < 5 && (
                            <View style={styles.criticalTag}>
                              <Text style={styles.criticalText}>LOW STOCK</Text>
                            </View>
                          )}
                          <IconButton 
                            {...props} 
                            icon="delete" 
                            iconColor="#d32f2f" 
                            onPress={() => handleDelete(item.id)} 
                          />
                        </View>
                      )}
                    />
                    <Card.Content style={styles.cardContent}>
                      <View style={styles.productInfo}>
                        <Text style={styles.productStock}>Stock: {item.stock}</Text>
                        <Text style={styles.productDetails}>
                          {item.category} / {item.brand} / {item.warehouse}
                        </Text>
                      </View>
                      <TextInput
                        ref={stockInputRef}
                        style={styles.stockInput}
                        placeholder="New stock"
                        keyboardType="numeric"
                        onSubmitEditing={(e) => {
                          handleStockUpdate(item.id, e.nativeEvent.text);
                          stockInputRef.current?.clear();
                        }}
                      />
                    </Card.Content>
                  </Card>
                </Pressable>
              );
            }}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No products found</Text>
                <Text style={styles.emptySubtext}>Add your first product using the "Add Product" tab</Text>
              </View>
            )}
          />

          {/* Product Detail Modal */}
          <Modal
            visible={!!selectedProduct}
            animationType="slide"
            transparent
            onRequestClose={() => setSelectedProduct(null)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Product Details</Text>
                
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Name:</Text>
                  <Text style={styles.modalValue}>{selectedProduct?.name}</Text>
                </View>
                
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Stock:</Text>
                  <Text style={[
                    styles.modalValue,
                    { color: (selectedProduct?.stock || 0) < 5 ? '#d32f2f' : '#43a047' }
                  ]}>
                    {selectedProduct?.stock}
                  </Text>
                </View>
                
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Category:</Text>
                  <Text style={styles.modalValue}>{selectedProduct?.category}</Text>
                </View>
                
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Brand:</Text>
                  <Text style={styles.modalValue}>{selectedProduct?.brand}</Text>
                </View>
                
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Warehouse:</Text>
                  <Text style={styles.modalValue}>{selectedProduct?.warehouse}</Text>
                </View>

                {selectedProduct?.barcode && (
                  <View style={styles.modalField}>
                    <Text style={styles.modalLabel}>Barcode:</Text>
                    <Text style={styles.modalValue}>{selectedProduct.barcode}</Text>
                  </View>
                )}

                {selectedProduct?.history && selectedProduct.history.length > 0 && (
                  <View style={styles.historyBox}>
                    <Text style={styles.historyTitle}>Stock Movements</Text>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyCol}>Type</Text>
                      <Text style={styles.historyCol}>Amount</Text>
                      <Text style={styles.historyCol}>Date</Text>
                    </View>
                    {selectedProduct.history.slice().reverse().slice(0, 5).map((historyItem, index) => (
                      <View key={index} style={styles.historyRow}>
                        <Text style={[
                          styles.historyCol, 
                          { 
                            color: historyItem.type === 'in' ? '#43a047' : '#d32f2f', 
                            fontWeight: 'bold' 
                          }
                        ]}>
                          {historyItem.type.toUpperCase()}
                        </Text>
                        <Text style={styles.historyCol}>{historyItem.amount}</Text>
                        <Text style={styles.historyCol}>
                          {new Date(historyItem.date).toLocaleDateString()}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <PaperButton 
                  mode="contained" 
                  style={styles.closeBtn} 
                  onPress={() => setSelectedProduct(null)}
                >
                  Close
                </PaperButton>
              </View>
            </View>
          </Modal>
        </>
      )}

      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar('')}
        duration={2000}
        style={styles.snackbar}
      >
        {snackbar}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  homeBtn: {
    borderRadius: 8,
    marginLeft: 8,
    elevation: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
    textAlign: 'left',
    letterSpacing: 1,
  },
  reportsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  reportsBtn: {
    borderRadius: 8,
    marginLeft: 8,
  },
  tabs: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fffde7',
    elevation: 2,
  },
  formCard: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
  addBtn: {
    marginTop: 8,
    borderRadius: 8,
    elevation: 2,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#43a047',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 32,
  },
  productCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#1976d2',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  productInfo: {
    flex: 1,
  },
  productStock: {
    fontSize: 18,
    color: '#1976d2',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productDetails: {
    color: '#888',
    fontSize: 14,
  },
  stockInput: {
    flex: 1,
    maxWidth: 120,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    elevation: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalField: {
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  modalValue: {
    fontSize: 18,
    color: '#222',
    fontWeight: '600',
  },
  historyBox: {
    marginTop: 20,
    width: '100%',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#e0e0e0',
    paddingBottom: 8,
    marginBottom: 4,
  },
  historyRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    paddingVertical: 4,
  },
  historyCol: {
    flex: 1,
    fontSize: 13,
    textAlign: 'center',
  },
  closeBtn: {
    marginTop: 20,
  },
  criticalTag: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    alignSelf: 'center',
  },
  criticalText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  snackbar: {
    backgroundColor: '#43a047',
    borderRadius: 8,
  },
});