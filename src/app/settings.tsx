import { ScrollView, Text, View } from 'react-native';

import PomodoroSettings from '../components/PomodoroSettings';

function Settings() {
  return (
    <ScrollView className="bg-black">
      <View className="flex-1 gap-y-5 p-5">
        <PomodoroSettings />
      </View>
    </ScrollView>
  );
}

export default Settings;
