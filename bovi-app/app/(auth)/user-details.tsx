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
    farmName: '',
    location: '',
    phone: '', // This will be pre-filled from OTP verification
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!formData.farmName.trim()) {
      Alert.alert('Error', 'Please enter your farm name');
      return false;
    }
    if (!formData.location.trim()) {
      Alert.alert('Error', 'Please enter your location');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      
      // Simulate API call to save user details
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, save to Supabase/backend
      // await supabase.from('profiles').insert({
      //   user_id: currentUser.id,
      //   name: formData.name,
      //   farm_name: formData.farmName,
      //   location: formData.location,
      //   phone: formData.phone,
      //   created_at: new Date().toISOString()
      // });

      Alert.alert(
        'Success!', 
        'Your profile has been created successfully.',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );
      
    } catch (error) {
      Alert.alert('Error', 'Failed to create profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Profile Setup',
      'You can complete your profile later from the Profile tab.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Skip', 
          onPress: () => router.replace('/(tabs)')
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.select({ ios: 'padding', default: undefined })} 
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>Complete Your Profile</ThemedText>
          <ThemedText style={styles.subtitle}>
            Tell us about yourself and your farm
          </ThemedText>
        </ThemedView>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Full Name *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Farm Name *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your farm name"
              value={formData.farmName}
              onChangeText={(text) => handleInputChange('farmName', text)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Location *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="City, State/Province, Country"
              value={formData.location}
              onChangeText={(text) => handleInputChange('location', text)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Phone Number</ThemedText>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              placeholder="Phone number from verification"
              value={formData.phone}
              editable={false}
            />
            <ThemedText style={styles.helpText}>
              This is the phone number you verified
            </ThemedText>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={handleSkip}
          >
            <ThemedText style={styles.skipButtonText}>Skip for now</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={submitting}
          >
            <ThemedText style={styles.submitButtonText}>
              {submitting ? 'Creating Profile...' : 'Complete Profile'}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            You can update these details anytime from your profile
          </ThemedText>
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
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  formContainer: {
    padding: 20,
    gap: 20,
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
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#f8f8f8',
    color: '#666',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  skipButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
