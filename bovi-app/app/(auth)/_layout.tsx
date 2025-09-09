import { Stack, Link } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
          headerLeft: () => (
            <Link href="/welcome" asChild>
              <TouchableOpacity accessibilityRole="button" style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ fontSize: 18 }}>←</Text>
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Create account',
          headerLeft: () => (
            <Link href="/welcome" asChild>
              <TouchableOpacity accessibilityRole="button" style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ fontSize: 18 }}>←</Text>
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
    </Stack>
  );
}


