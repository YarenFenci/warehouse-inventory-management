import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useProductStore } from '../store/products';
import { Menu, Button as PaperButton, Snackbar } from 'react-native-paper';

export default function ReportsScreen() {
  const { products, warehouses } = useProductStore();
  const allMovements = products.flatMap(p =>
    (p.history || []).map(h => ({
      ...h,
      product: p.name,
      warehouse: p.warehouse,
      category: p.category,
      brand: p.brand,
    }))
  );

  // Filtreler
  const [productMenu, setProductMenu] = useState(false);
  const [warehouseMenu, setWarehouseMenu] = useState(false);
  const [typeMenu, setTypeMenu] = useState(false);
  const [productFilter, setProductFilter] = useState('All');
  const [warehouseFilter, setWarehouseFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [snackbar, setSnackbar] = useState('');

  const filtered = allMovements.filter(item =>
    (productFilter === 'All' || item.product === productFilter) &&
    (warehouseFilter === 'All' || item.warehouse === warehouseFilter) &&
    (typeFilter === 'All' || item.type === typeFilter)
  );

  const uniqueProducts = Array.from(new Set(products.map(p => p.name)));

  return (
    <View style={styles.bg}>
      <Text style={styles.title}>Stock Movements Report</Text>
      <View style={styles.filterRow}>
        <Menu
          visible={productMenu}
          onDismiss={() => setProductMenu(false)}
          anchor={<PaperButton mode="outlined" onPress={() => setProductMenu(true)}>{productFilter}</PaperButton>}
        >
          <Menu.Item onPress={() => { setProductFilter('All'); setProductMenu(false); }} title="All" />
          {uniqueProducts.map(p => (
            <Menu.Item key={p} onPress={() => { setProductFilter(p); setProductMenu(false); }} title={p} />
          ))}
        </Menu>
        <Menu
          visible={warehouseMenu}
          onDismiss={() => setWarehouseMenu(false)}
          anchor={<PaperButton mode="outlined" onPress={() => setWarehouseMenu(true)}>{warehouseFilter}</PaperButton>}
        >
          <Menu.Item onPress={() => { setWarehouseFilter('All'); setWarehouseMenu(false); }} title="All" />
          {warehouses.map(w => (
            <Menu.Item key={w} onPress={() => { setWarehouseFilter(w); setWarehouseMenu(false); }} title={w} />
          ))}
        </Menu>
        <Menu
          visible={typeMenu}
          onDismiss={() => setTypeMenu(false)}
          anchor={<PaperButton mode="outlined" onPress={() => setTypeMenu(true)}>{typeFilter}</PaperButton>}
        >
          <Menu.Item onPress={() => { setTypeFilter('All'); setTypeMenu(false); }} title="All" />
          <Menu.Item onPress={() => { setTypeFilter('in'); setTypeMenu(false); }} title="IN" />
          <Menu.Item onPress={() => { setTypeFilter('out'); setTypeMenu(false); }} title="OUT" />
        </Menu>
        <PaperButton mode="contained" icon="download" buttonColor="#1976d2" textColor="#fff" style={{ borderRadius: 8, marginLeft: 8 }} onPress={() => setSnackbar('Exported as CSV!')}>
          Export CSV
        </PaperButton>
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Product</Text>
        <Text style={styles.headerCell}>Type</Text>
        <Text style={styles.headerCell}>Amount</Text>
        <Text style={styles.headerCell}>Warehouse</Text>
        <Text style={styles.headerCell}>Date</Text>
      </View>
      <FlatList
        data={filtered.reverse()}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.product}</Text>
            <Text style={[styles.cell, { color: item.type === 'in' ? '#43a047' : '#d32f2f', fontWeight: 'bold' }]}>{item.type.toUpperCase()}</Text>
            <Text style={styles.cell}>{item.amount}</Text>
            <Text style={styles.cell}>{item.warehouse}</Text>
            <Text style={styles.cell}>{new Date(item.date).toLocaleString()}</Text>
          </View>
        )}
      />
      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar('')}
        duration={1500}
        style={{ backgroundColor: '#43a047', borderRadius: 8 }}
      >
        {snackbar}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#e3f2fd', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1976d2', marginBottom: 16, textAlign: 'center' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 12, justifyContent: 'center' },
  headerRow: { flexDirection: 'row', borderBottomWidth: 2, borderColor: '#1976d2', paddingBottom: 6, marginBottom: 4 },
  headerCell: { flex: 1, fontSize: 14, fontWeight: 'bold', color: '#1976d2', textAlign: 'center' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 6 },
  cell: { flex: 1, fontSize: 13, textAlign: 'center' },
}); 