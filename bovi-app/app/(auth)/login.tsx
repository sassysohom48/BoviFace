import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function isValidEmail(value: string) {
    return /.+@.+\..+/.test(value);
  }

  async function onSubmit() {
    if (!isValidEmail(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Invalid password', 'Password must be at least 6 characters.');
      return;
    }
    try {
      setSubmitting(true);
      // Simulate auth. Replace with real API call.
      await new Promise((r) => setTimeout(r, 800));
      router.replace('/(auth)/purpose');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', default: undefined })} style={{ flex: 1 }}>
      <ParallaxContainer>
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="title">Welcome back</ThemedText>
          <ThemedText type="default">Sign in to continue</ThemedText>
        </ThemedView>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TouchableOpacity onPress={onSubmit} disabled={submitting} style={[styles.button, submitting && { opacity: 0.6 }]}>
            <ThemedText type="defaultSemiBold" style={{ textAlign: 'center' }}>{submitting ? 'Signing in…' : 'Sign In'}</ThemedText>
          </TouchableOpacity>

          <ThemedText style={{ textAlign: 'center', marginTop: 8 }}>
            New here? <Link href="/(auth)/signup">Create an account</Link>
          </ThemedText>
          <ThemedText style={{ textAlign: 'center', marginTop: 8 }}>
            Prefer phone? <Link href="/(auth)/phone">Use phone instead</Link>
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
});


