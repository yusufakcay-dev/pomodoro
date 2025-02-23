import { Stack } from 'expo-router';
import '~/global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView>
      <Stack screenOptions={{}}>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        {/* <Stack.Screen name="list" options={{ title: 'List' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} /> */}
      </Stack>
    </GestureHandlerRootView>
  );
}
