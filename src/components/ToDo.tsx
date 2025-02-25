import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import TaskItem from './TaskItem';
import { useTasksStore } from '../stores/TasksStore';

function ToDo() {
  const {
    addItem,
    input,
    tasks,
    completedTasksVisibility,
    setCompletedTasksVisibility,
    completedTasks,
    setInput,
  } = useTasksStore();

  return (
    <View className="flex-1 justify-between bg-[#080808]">
      <ScrollView className="">
        {tasks.map((item) => (
          <TaskItem key={item.id} item={item} arrayType="completed" />
        ))}
        <Pressable
          onPress={() => setCompletedTasksVisibility(!completedTasksVisibility)}
          className="h-20 flex-row items-center rounded-lg px-3">
          <MaterialCommunityIcons
            name={completedTasksVisibility ? 'chevron-down' : 'chevron-right'}
            size={35}
            color="white"
          />
          <Text className="text-2xl text-white">Completed</Text>
        </Pressable>
        {completedTasks.map(
          (item) =>
            completedTasksVisibility && (
              <TaskItem key={item.id} item={item} arrayType="uncompleted" />
            )
        )}
      </ScrollView>
      <View className="h-14 flex-row items-center justify-between bg-white/10 px-3">
        <TextInput
          value={input}
          maxLength={250}
          onChangeText={(e) => setInput(e)}
          className="flex-1 text-white"
        />
        <MaterialCommunityIcons
          onPress={() => addItem()}
          name="arrow-up-box"
          size={35}
          color="white"
        />
      </View>
    </View>
  );
}

export default ToDo;
