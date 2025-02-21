import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
function Settings() {
  const [sliderValue, setSliderValue] = useState(25);
  const progress = useSharedValue(30);
  const min = useSharedValue(0);
  const max = useSharedValue(240);

  const Days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <ScrollView className="bg-black">
      <View className="flex-1 gap-y-5 p-5">
        <Text className="text-2xl text-white">Reminder</Text>
        <View className="mx-3 flex-row justify-between">
          {Days.map((day, index) => (
            <View
              key={index}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30">
              <Text className="text-lg font-bold text-white">{day}</Text>
            </View>
          ))}
        </View>
        <Text className="text-2xl text-white">Reminder Time</Text>
        <Text className="text-2xl text-white">09:00</Text>
        <Slider
          style={{ width: 300, height: 40 }}
          minimumValue={1}
          maximumValue={300}
          step={1}
          onValueChange={(val) => setSliderValue(val)}
          minimumTrackTintColor="white"
          maximumTrackTintColor="white"
          thumbTintColor="white"
        />
        <Text className="text-white">{sliderValue}</Text>
      </View>
    </ScrollView>
  );
}

export default Settings;
