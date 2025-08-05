import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Snackbar, Button as PaperButton, Card, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [snackbar, setSnackbar] = useState('');
  const router = useRouter();

  const onSend = () => {
    if (!email) {
      setSnackbar('Please enter your email!');
      return;
    }
    setSnackbar('Reset link sent to your email!');
    setTimeout(() => router.replace('/login'), 1200);
  };

  return (
    <View style={styles.bg}>
      <Card style={styles.card}>
        <Card.Title title="Forgot Password" left={(props) => <Avatar.Icon {...props} icon="lock-reset" color="#fff" style={{ backgroundColor: '#1976d2' }} />} />
        <Card.Content>
          <Text style={styles.label}>Enter your email address to receive a reset link.</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <PaperButton mode="contained" buttonColor="#1976d2" style={styles.btn} onPress={onSend}>
            Send Reset Link
          </PaperButton>
        </Card.Content>
      </Card>
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
  bg: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e3f2fd' },
  card: { width: 340, borderRadius: 18, elevation: 8 },
  label: { fontSize: 15, color: '#888', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#bdbdbd', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16, backgroundColor: '#f5f5f5' },
  btn: { borderRadius: 8 },
}); 