import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';

export default function PhoneScreen() {
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleSendOtp = () => {
    if (phone.length >= 10) {
      router.push('/otp');
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title">Enter Phone Number</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Enter phone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TouchableOpacity style={styles.btn} onPress={handleSendOtp}>
        <ThemedText style={{ color: '#fff' }}>Send OTP</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, gap: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: '#0a84ff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
});

 