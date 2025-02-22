import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { usePomodoroTimerStore } from '../stores/PomodoroTimerStore';

function PomodoroTimer() {
  const { isTicking, tick, startStopTimer, session } = usePomodoroTimerStore();

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isTicking) {
      timerId = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isTicking, tick]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  return (
    <View className="flex-1 justify-center bg-black">
      <Pressable
        onTouchStart={() => {
          startStopTimer();
        }}>
        <Text style={styles.clock} className="font-thin">
          {formatTime(session)}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  clock: {
    fontSize: RFPercentage(20),
    textAlign: 'center',
    color: 'white',
  },
});
export default PomodoroTimer;
