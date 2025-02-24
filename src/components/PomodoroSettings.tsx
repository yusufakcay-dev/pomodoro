import { Switch, Text, View } from 'react-native';
import { usePomodoroTimerStore } from '../stores/PomodoroTimerStore';
import SliderComponent from './SliderComponent';
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
    <>
      {' '}
      <Text className="text-2xl text-cyan-300">Pomodoro Settings</Text>
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
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={longBreak ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setLongBreak}
          value={longBreak}
        />
      </View>
      {longBreak && (
        <>
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
        </>
      )}
      <View className="flex-row justify-between ">
        <Text className="text-2xl text-white">Auto Start Focus</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={longBreak ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setContinueAfterBreak}
          value={continueAfterBreak}
        />
      </View>
      <View className="flex-row justify-between ">
        <Text className="text-2xl text-white">Auto Start Break</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={longBreak ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setContinueAfterFocus}
          value={continueAfterFocus}
        />
      </View>
    </>
  );
}

export default PomodoroSettings;
