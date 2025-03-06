import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

import { usePomodoroTimerStore } from '../stores/PomodoroTimerStore';
import { useTasksStore } from '../stores/TasksStore';

interface BarChartItem {
  value: number;
  label: string;
}

function Analytics() {
  const { dailyRecords, focusCount, totalFocusTime, totalBreakTime } = usePomodoroTimerStore();
  const { totalTaskDone } = useTasksStore();

  // Accept seconds and format to "Xh Ym"
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m`;
  };

  // Get today's date string in "YYYY-MM-DD" format
  const todayDate = new Date().toISOString().split('T')[0];
  // Retrieve today's record from dailyRecords (or default to zeros if not found)
  const todaysRecord = dailyRecords.find((record) => record.date === todayDate) || {
    focusCount: 0,
    focusTime: 0,
  };

  // Helper function to get the last 7 days data
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      days.push({ date: dateStr, label: dayLabel });
    }
    return days;
  };

  const last7Days = getLast7Days();

  // Map the last 7 days to chart data. If no focus data exists for a given day, default to 0.
  const chartData = last7Days.map((day) => {
    const dataItem = dailyRecords.find((item) => item.date === day.date);
    return {
      value: dataItem ? dataItem.focusTime / 3600 : 0,
      label: day.label,
    };
  });

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="items-center gap-y-10 py-10">
        <View className="w-full flex-row justify-between px-10 ">
          <View className="w-44 items-center">
            <Ionicons name="today-outline" size={35} color="white" />
            <Text className="mt-2 text-xl text-white">Today's pomo</Text>
            <Text className="mt-2 text-2xl font-bold text-white">{todaysRecord.focusCount}</Text>
          </View>
          <View className="w-44 items-center">
            <Ionicons name="hourglass-outline" size={35} color="white" />
            <Text className="mt-2 text-xl text-white">Today's focus(h)</Text>
            <Text className="mt-2 text-2xl font-bold text-white">
              {formatTime(todaysRecord.focusTime)}
            </Text>
          </View>
        </View>
        <View className="w-full flex-row justify-between px-10">
          <View className="w-44 items-center">
            <Ionicons name="timer-outline" size={35} color="white" />
            <Text className="mt-2 text-xl text-white">Pomo done</Text>
            <Text className="mt-2 text-2xl font-bold text-white">{focusCount}</Text>
          </View>
          <View className="w-44 items-center">
            <Ionicons name="checkbox-outline" size={35} color="white" />
            <Text className="mt-2 text-xl text-white">Task done</Text>
            <Text className="mt-2 text-2xl font-bold text-white">{totalTaskDone}</Text>
          </View>
        </View>
        <View className="w-full flex-row justify-between px-10">
          <View className="w-44 items-center">
            <Ionicons name="time-outline" size={35} color="white" />
            <Text className="mt-2 text-xl text-white">Focus Time</Text>
            <Text className="mt-2 text-2xl font-bold text-white">{formatTime(totalFocusTime)}</Text>
          </View>
          <View className="w-44 items-center">
            <Ionicons name="alarm-outline" size={35} color="white" />
            <Text className="mt-2 text-xl text-white">Break Time</Text>
            <Text className="mt-2 text-2xl font-bold text-white">{formatTime(totalBreakTime)}</Text>
          </View>
        </View>
        <View className="">
          <Text className="mb-2 text-2xl font-bold text-white">Focus(h)</Text>
          <BarChart
            frontColor="white"
            barWidth={20}
            spacing={20}
            data={chartData}
            showLine
            lineConfig={{
              color: 'white',
              thickness: 0.5,
              curved: true,
              hideDataPoints: true,
              shiftY: 30,
            }}
            roundedTop
            roundedBottom
            yAxisTextStyle={{ color: 'white' }}
            xAxisLabelTextStyle={{ color: 'white' }}
            isAnimated
            noOfSections={5} // Adjust y-axis sections as needed
            yAxisThickness={0} // Hides the y-axis line
            xAxisThickness={0} // Hides the x-axis line
            color="white" // Contrast color for the bars
            renderTooltip={(item: BarChartItem) => (
              <View
                style={{
                  paddingHorizontal: 0,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}>
                <Text className="text-xl text-white">{item.value}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default Analytics;
