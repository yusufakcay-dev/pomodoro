// import Slider from '@react-native-community/slider';
// import { ScrollView, Text, View } from 'react-native';

// import { settingStore } from '../store/Store';
// function Settings() {
//   const settings = settingStore((setting) => setting);

//   const Days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
//   const SliderComponent = ({ header, maxValue, sliderValue, setSliderValue }: any) => {
//     return (
//       <View>
//         <Text className="text-2xl text-white">{header}</Text>
//         <View className="flex-row justify-between">
//           <Slider
//             style={{ width: 300, height: 40 }}
//             minimumValue={1}
//             maximumValue={maxValue}
//             step={1}
//             value={settings.focusTime}
//             onValueChange={(value: any) => settings.setFocusTime(value)}
//             minimumTrackTintColor="white"
//             maximumTrackTintColor="white"
//             thumbTintColor="white"
//           />
//           <Text className="text-2xl text-white">{sliderValue}</Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <ScrollView className="bg-black">
//       <View className="flex-1 gap-y-5 p-5">
//         <Text className="text-2xl text-white">Reminder</Text>
//         <View className="mx-3 flex-row justify-between">
//           {Days.map((day, index) => (
//             <View
//               key={index}
//               className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30">
//               <Text className="text-lg font-bold text-white">{day}</Text>
//             </View>
//           ))}
//         </View>
//         <View>
//           <Text className="text-2xl text-white">Reminder Time</Text>
//           <Text className="text-2xl text-white">09:00</Text>
//         </View>
//         <View>
//           <Text className="text-2xl text-white">Focus Time</Text>
//           <View className="flex-row justify-between">
//             <Slider
//               style={{ width: 300, height: 40 }}
//               minimumValue={1}
//               maximumValue={300}
//               step={1}
//               onValueChange={(value: any) => settings.setFocusTime(value)}
//               minimumTrackTintColor="white"
//               maximumTrackTintColor="white"
//               thumbTintColor="white"
//             />
//             <Text className="text-2xl text-white">{settings.focusTime}</Text>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// export default Settings;
