
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/auth';
import { CartProvider } from '../context/cart';
import { DataProvider } from '../context/data';

export default function RootLayout() {
  return (
    <AuthProvider>
      <DataProvider>
        <CartProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(admin)" options={{ headerShown: false }} />
            <Stack.Screen name="(customer)" options={{ headerShown: false }} />
          </Stack>
        </CartProvider>
      </DataProvider>
    </AuthProvider>
  );
}
