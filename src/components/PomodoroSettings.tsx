import { Switch, Text, View } from 'react-native';

import SliderComponent from './SliderComponent';
import { usePomodoroTimerStore } from '../stores/PomodoroTimerStore';
import Animated, { FadeIn } from 'react-native-reanimated';
function PomodoroSettings() {
  const {
    setFocusTime,
    focusSession,
    breakSession,
    setBreakTime,
    longBreak,
    setLongBreak,
    longBreakSession,
    setLongBreakTime,
    longBreakEverySession,
    setLongBreakEverySession,
    continueAfterBreak,
    setContinueAfterBreak,
    continueAfterFocus,
    setContinueAfterFocus,
  } = usePomodoroTimerStore();

  return (
    <Animated.View className="flex-1 gap-y-5 p-5">
      <SliderComponent
        header="Focus Time"
        maxValue={300}
        sliderValue={focusSession}
        setSliderValue={setFocusTime}
      />
      <SliderComponent
        header="Break Time"
        maxValue={300}
        sliderValue={breakSession}
        setSliderValue={setBreakTime}
      />
      <View className="flex-row justify-between ">
        <Text className="text-2xl text-white">Enable Long Break</Text>
        <Switch
          trackColor={{ false: 'white', true: 'white' }}
          thumbColor={longBreak ? 'white' : 'white'}
          onValueChange={setLongBreak}
          value={longBreak}
        />
      </View>
      {longBreak && (
        <View>
          <SliderComponent
            header="Long Break Time"
            maxValue={300}
            sliderValue={longBreakSession}
            setSliderValue={setLongBreakTime}
          />
          <SliderComponent
            header="Sessions Before Long Break"
            maxValue={300}
            sliderValue={longBreakEverySession}
            setSliderValue={setLongBreakEverySession}
          />
        </View>
      )}
      <View className="flex-row justify-between ">
        <Text className="text-2xl text-white">Auto Start Focus</Text>
        <Switch
          trackColor={{ false: 'white', true: 'white' }}
          thumbColor={continueAfterBreak ? 'white' : 'white'}
          onValueChange={setContinueAfterBreak}
          value={continueAfterBreak}
        />
      </View>
      <View className="flex-row justify-between ">
        <Text className="text-2xl text-white">Auto Start Break</Text>
        <Switch
          trackColor={{ false: 'white', true: 'white' }}
          thumbColor={continueAfterFocus ? 'white' : 'white'}
          onValueChange={setContinueAfterFocus}
          value={continueAfterFocus}
        />
      </View>
    </Animated.View>
  );
}

export default PomodoroSettings;
