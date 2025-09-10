import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SignupScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    age: '',
    gender: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  async function onSubmit() {
    if (formData.phone.trim().length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      setSubmitting(true);
      
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'OTP sent! (Demo mode)');
      
      // Navigate to OTP screen
      router.push('/(auth)/otp');
    } catch (error) {
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
          <ThemedText type="title">Sign up with phone</ThemedText>
          <ThemedText type="default">We'll send an OTP</ThemedText>
        </ThemedView>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Phone number *"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            autoCapitalize="none"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            placeholderTextColor="#999"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Age"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={formData.age}
            onChangeText={(value) => handleInputChange('age', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Gender (Male/Female/Other)"
            placeholderTextColor="#999"
            value={formData.gender}
            onChangeText={(value) => handleInputChange('gender', value)}
          />

          <TouchableOpacity 
            onPress={onSubmit} 
            disabled={submitting || formData.phone.trim().length < 10 || !formData.name.trim()} 
            style={[styles.button, (submitting || formData.phone.trim().length < 10 || !formData.name.trim()) && { opacity: 0.6 }]}
          >
            <ThemedText type="defaultSemiBold" style={{ textAlign: 'center' }}>
              {submitting ? 'Sending…' : 'Send OTP'}
            </ThemedText>
          </TouchableOpacity>

          <ThemedText style={{ textAlign: 'center', marginTop: 16 }}>
            Already have an account? <Link href="/(auth)/login" style={styles.link}>Sign in</Link>
          </ThemedText>
        </View>
      </ParallaxContainer>
    </KeyboardAvoidingView>
  );
}

function ParallaxContainer({ children }: { children: React.ReactNode }) {
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