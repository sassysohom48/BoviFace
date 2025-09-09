import { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PurposeScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handleSelect = (choice: string) => {
    setSelected(choice);
  };

  // ⏩ Auto-redirect after choosing
  useEffect(() => {
    if (selected) {
      router.replace('/(tabs)/community'); // goes to community tab
    }
  }, [selected]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/welcome.jpg')}
        style={styles.heroImage}
        contentFit="cover"
      />

      <ThemedView style={styles.card}>
        <ThemedText type="title" style={{ textAlign: 'center' }}>
          What brings you here
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', marginBottom: 12 }}>
          Please choose one option
        </ThemedText>

        <TouchableOpacity
          style={[styles.option, selected === 'identify' && styles.optionSelected]}
          onPress={() => handleSelect('identify')}
        >
          <Ionicons name="camera" size={18} color="#fff" />
          <ThemedText style={styles.optionText}>Identify any cattle</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, selected === 'community' && styles.optionSelected]}
          onPress={() => handleSelect('community')}
        >
          <Ionicons name="people" size={18} color="#fff" />
          <ThemedText style={styles.optionText}>Join Cattle Community</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, selected === 'advice' && styles.optionSelected]}
          onPress={() => handleSelect('advice')}
        >
          <Ionicons name="medkit" size={18} color="#fff" />
          <ThemedText style={styles.optionText}>Get Cattle Care Advice</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 16,
    gap: 16,
  },
  heroImage: {
    flex: 1,
    borderRadius: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  optionSelected: {
    backgroundColor: 'rgba(0,200,100,0.4)',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
