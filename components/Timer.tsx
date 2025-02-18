import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

const FOCUS_TIME_MINUTES = 5 * 60 * 1000;
const BREAK_TIME_MINUTES = 1 * 60 * 1000;
function Timer() {
  const [timerCount, setTimerCount] = useState(FOCUS_TIME_MINUTES);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [timerMode, setTimerMode] = useState('Focus');
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (timerCount === 0) {
      if (timerMode === 'Focus') {
        setTimerMode('Break');
        setTimerCount(BREAK_TIME_MINUTES);
      } else {
        setTimerMode('Focus');
        setTimerCount(FOCUS_TIME_MINUTES);
      }
      stopCountDown();
    }
  }, [timerCount]);

  const startCountDown = () => {
    setIsTimerRunning(true);
    const id = setInterval(() => setTimerCount((prev) => prev - 10000), 1000);
    setIntervalId(id);
  };

  const stopCountDown = () => {
    setIsTimerRunning(false);
    if (intervalId) {
      clearInterval(intervalId);
    }
    setIntervalId(null);
  };

  return (
    <View className="flex-1 justify-center bg-black">
      <Pressable
        onTouchStart={() => {
          if (!isTimerRunning) {
            startCountDown();
          } else {
            stopCountDown();
          }
        }}>
        <Text style={styles.clock} className="font-thin">
          {new Date(timerCount).getMinutes().toString().padStart(2, '0')}:
          {new Date(timerCount).getSeconds().toString().padStart(2, '0')}
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
export default Timer;
