import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function isValidEmail(value: string) {
    return /.+@.+\..+/.test(value);
  }

  async function onSubmit() {
    if (name.trim().length < 2) {
      Alert.alert('Invalid name', 'Please enter your name.');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      // Simulate API
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
          <ThemedText type="title">Create account</ThemedText>
          <ThemedText type="default">Join to continue</ThemedText>
        </ThemedView>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Full name"
            placeholderTextColor="#999"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
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
          <TextInput
            placeholder="Confirm password"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
          />

          <TouchableOpacity onPress={onSubmit} disabled={submitting} style={[styles.button, submitting && { opacity: 0.6 }]}>
            <ThemedText type="defaultSemiBold" style={{ textAlign: 'center' }}>{submitting ? 'Creating…' : 'Create account'}</ThemedText>
          </TouchableOpacity>

          <ThemedText style={{ textAlign: 'center', marginTop: 8 }}>
            Already have an account? <Link href="/(auth)/login">Log in</Link>
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


