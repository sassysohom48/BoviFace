import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    if (phone.trim().length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    try {
      setSubmitting(true);
      
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'OTP sent! (Demo mode)');
      
      // Navigate to OTP screen with phone number
      router.push({
        pathname: '/(auth)/otp',
        params: { phone: phone }
      });
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', default: undefined })} style={{ flex: 1 }}>
      <ParallaxContainer>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={styles.backButtonText}>←</ThemedText>
          </TouchableOpacity>
        </View>
        
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="title">Sign in with phone</ThemedText>
          <ThemedText type="default">We'll send an OTP</ThemedText>
        </ThemedView>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            autoCapitalize="none"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
          />

          <TouchableOpacity onPress={onSubmit} disabled={submitting || phone.trim().length < 10} style={[styles.button, (submitting || phone.trim().length < 10) && { opacity: 0.6 }]}>
            <ThemedText type="defaultSemiBold" style={{ textAlign: 'center' }}>{submitting ? 'Sending…' : 'Send OTP'}</ThemedText>
          </TouchableOpacity>

          <ThemedText style={{ textAlign: 'center', marginTop: 16 }}>
            New here? <Link href="/(auth)/signup" style={styles.link}>Create an account</Link>
          </ThemedText>
        </View>
      </ParallaxContainer>
    </KeyboardAvoidingView>
  );
}

function ParallaxContainer({ children }: { children: React.ReactNode }) {
  // Minimal container to match app visuals without importing the Parallax component here
  return <View style={{ flex: 1, padding: 24, gap: 16 }}>{children}</View>;
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  headerContainer: {
    gap: 4,
    marginTop: 24,
  },
  formContainer: {
    gap: 12,
    marginTop: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
  },
  link: {
    color: '#007AFF',
    fontWeight: '600',
  },
});


