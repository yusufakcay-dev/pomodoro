import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
interface Props {
  header: string;
  maxValue: number;
  sliderValue: number;
  setSliderValue: (value: number) => void;
}

function SliderComponent({ header, maxValue, sliderValue, setSliderValue }: Props) {
  const [localSliderValue, setlocalSliderValue] = useState(sliderValue);

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      className="mx-0.5">
      <Text className="text-2xl text-white">{header}</Text>
      <View className="flex-row justify-between">
        <Slider
          style={{ width: 300, height: 40 }}
          minimumValue={1}
          maximumValue={maxValue}
          value={sliderValue}
          onValueChange={(val) => setlocalSliderValue(val)}
          onSlidingComplete={(val) => setSliderValue(val)}
          step={1}
          minimumTrackTintColor="white"
          maximumTrackTintColor="white"
          thumbTintColor="white"
        />
        <Text className="text-2xl text-white">{localSliderValue}</Text>
      </View>
    </Animated.View>
  );
}

export default SliderComponent;
