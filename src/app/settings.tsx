import { ScrollView, View } from 'react-native';

import PomodoroSettings from '../components/PomodoroSettings';

function Settings() {
  return (
    <ScrollView className="bg-black">
      <View className="flex-1">
        <PomodoroSettings />
      </View>
    </ScrollView>
  );
}

export default Settings;
