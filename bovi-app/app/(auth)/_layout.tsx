import { Stack, Link } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          title: 'Sign In',
          headerShown: false, // Hide header for cleaner look
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Sign Up',
          headerShown: false, // Hide header for cleaner look
        }}
      />
      <Stack.Screen
        name="otp"
        options={{
          title: 'Verify OTP',
          headerShown: false, // Hide header for cleaner look
        }}
      />
      <Stack.Screen
        name="user-details"
        options={{
          title: 'Complete Profile',
          headerShown: false, // Hide header for cleaner look
        }}
      />
    </Stack>
  );
}


