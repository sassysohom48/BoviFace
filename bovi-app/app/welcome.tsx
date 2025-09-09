import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/welcome.jpg')}   // fixed path
        style={styles.heroImage}
        contentFit="cover"
      />

      <ThemedView style={styles.card}>
        <ThemedText type="title" style={{ textAlign: 'center' }}>
          Welcome To BoviFace
        </ThemedText>
        <ThemedText style={{ textAlign: 'center' }}>
          Empowering farmers with smart, precise, and accessible animal care
          solutions to boost productivity and wellbeing.
        </ThemedText>

        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.replace('/(auth)/login')}
          style={styles.cta}
        >
          <ThemedText type="defaultSemiBold" style={{ textAlign: 'center' }}>
            →
          </ThemedText>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    gap: 8,
  },
  cta: {
    alignSelf: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
});
