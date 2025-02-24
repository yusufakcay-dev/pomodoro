import { ScrollView, Text, View } from 'react-native';

import PomodoroSettings from '../components/PomodoroSettings';

function Settings() {
  const Days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <ScrollView className="bg-black">
      <View className="flex-1 gap-y-5 p-5">
        <Text className="text-2xl text-cyan-300">Reminder</Text>
        <View className="mx-3 flex-row justify-between">
          {Days.map((day, index) => (
            <View
              key={index}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30">
              <Text className="text-lg font-bold text-white">{day}</Text>
            </View>
          ))}
        </View>
        <View>
          <Text className="text-2xl text-white">Reminder Time</Text>
          <Text className="text-xl text-white">09:00</Text>
        </View>
        <View className="border border-white/30" />
        <PomodoroSettings />
      </View>
    </ScrollView>
  );
}

export default Settings;
