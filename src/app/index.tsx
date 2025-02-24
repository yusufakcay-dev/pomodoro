import * as Notifications from 'expo-notifications';
import { Link } from 'expo-router';
import { useEffect } from 'react';

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
    <>
      <PomodoroTimer />
      <Link href="/list">Go to About screen</Link>
      <Link href="/settings">Go to Settings screen</Link>
    </>
  );
}
