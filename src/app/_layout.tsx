import { Stack } from 'expo-router';
import '~/global.css';
import { View } from 'react-native';
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
      <View className="flex-1 bg-black">
        <Stack screenOptions={{}}>
          <Stack.Screen
            name="index"
            options={{
              title: '',
              headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: 'white',
              animation: 'default',
            }}
          />
          <Stack.Screen
            name="list"
            options={{
              title: 'To Do',
              headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: 'white',
              animation: 'default',
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
              animation: 'default',
            }}
          />
          <Stack.Screen
            name="statistics"
            options={{
              title: 'Statistics',
              headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: 'white',
              animation: 'default',
            }}
          />
        </Stack>
      </View>
    </GestureHandlerRootView>
  );
}
