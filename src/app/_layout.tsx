import { Stack } from 'expo-router';
import '~/global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

// This is the default configuration

export default function Layout() {
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
  });
  return (
    <GestureHandlerRootView>
      <Stack screenOptions={{}}>
        <Stack.Screen
          name="index"
          options={{
            title: 'Home',
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="list"
          options={{
            title: 'List',
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Settings',
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTintColor: 'white',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
