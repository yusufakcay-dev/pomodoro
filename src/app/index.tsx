import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Notifications from 'expo-notifications';
import { Link } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';

import { usePomodoroTimerStore } from '../stores/PomodoroTimerStore';

import PomodoroTimer from '~/src/components/PomodoroTimer';
async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return;
    }
  }
  console.log('Notification permissions granted');
}
export default function Home() {
  const { resetTimer } = usePomodoroTimerStore();

  const flingGesture = Gesture.Fling()
    .direction(Directions.DOWN)
    .onStart(() => runOnJS(resetTimer)());

  useEffect(() => {
    registerForPushNotificationsAsync();
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true, // Enable sound if needed
        shouldSetBadge: false,
      }),
    });
  }, []);
  return (
    <GestureDetector gesture={flingGesture}>
      <Animated.View className="flex-1 justify-between bg-black">
        <View className="flex-1 justify-center">
          <PomodoroTimer />
        </View>
        <View className="mx-16 my-5 flex-row items-center justify-between">
          <Link className="text-white" href="/list">
            <Ionicons name="list-sharp" size={35} color="white" />
          </Link>

          <Link className="text-white" href="/settings">
            <Ionicons name="settings-sharp" size={35} color="white" />
          </Link>
          <Link className="text-white" href="/statistics">
            <MaterialCommunityIcons name="google-analytics" size={35} color="white" />
          </Link>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
