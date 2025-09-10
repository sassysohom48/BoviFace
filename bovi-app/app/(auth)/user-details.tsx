import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function UserDetailsScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    farmName: '',
    location: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      setSubmitting(true);
      
      // Simulate profile update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Profile updated! (Demo mode)');
      
      // Navigate to purpose screen
      router.push('/(auth)/purpose');
      
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/purpose');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.select({ ios: 'padding', default: undefined })} 
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={styles.backButtonText}>←</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedView style={styles.headerContainer}>
          <ThemedText type="title">Complete Your Profile</ThemedText>
          <ThemedText type="default">Tell us about yourself</ThemedText>
        </ThemedView>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Full Name *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Age</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={formData.age}
              onChangeText={(value) => handleInputChange('age', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Gender</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Male/Female/Other"
              placeholderTextColor="#999"
              value={formData.gender}
              onChangeText={(value) => handleInputChange('gender', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Farm Name</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your farm name"
              placeholderTextColor="#999"
              value={formData.farmName}
              onChangeText={(value) => handleInputChange('farmName', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Location</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your location"
              placeholderTextColor="#999"
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting || !formData.name.trim()}
          >
            <ThemedText type="defaultSemiBold" style={styles.submitButtonText}>
              {submitting ? 'Saving...' : 'Save Profile'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <ThemedText style={styles.skipButtonText}>Skip for now</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    gap: 4,
    marginBottom: 24,
  },
  formContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});