import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';

export default function OtpScreen() {
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleVerify = () => {
    if (otp.length === 6) {
      router.replace('/(auth)/purpose');
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title">Enter OTP</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="6-digit code"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />
      <TouchableOpacity style={styles.btn} onPress={handleVerify}>
        <ThemedText style={{ color: '#fff' }}>Verify</ThemedText>
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


