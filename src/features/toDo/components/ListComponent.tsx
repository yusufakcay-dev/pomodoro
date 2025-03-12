import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import TaskItem from '../components/TaskItem';
import { useTasksStore, TaskListsGroupsType, TaskItemType } from '../stores/TasksStore';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
// Recursive helper to search for a list by id within groups
function findListInGroups(
  lists: TaskListsGroupsType[],
  listId: string
): TaskListsGroupsType | undefined {
  for (const item of lists) {
    if (item.type === 'list' && item.id === listId) {
      return item;
    } else if (item.type === 'group' && item.groups) {
      const found = findListInGroups(item.groups, listId);
      if (found) return found;
    }
  }
  return undefined;
}

export default function ListComponent() {
  const { listItem } = useLocalSearchParams<{ listItem: string }>();
  const [completedTasksVisibility, setCompletedTasksVisibility] = useState(false);
  const router = useRouter();
  const { taskListsGroups, addItem, input, setInput, deleteListGroup } = useTasksStore();

  // Use the recursive helper to find the current list even if it is nested within groups.
  const currentList = findListInGroups(taskListsGroups, listItem);

  // Fallback to empty arrays if the list is not found.
  const taskList = currentList?.tasks || [];
  const completedTaskList = currentList?.completedTasks || [];

  return (
    <View className="flex-1 bg-black">
      <Stack.Screen
        options={{
          title: `${currentList?.name}`,
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: 'white',
          headerRight: () => (
            <Pressable
              onPress={() => {
                deleteListGroup(listItem);
                router.back();
              }}>
              <FontAwesome6 name="trash-can" size={24} color="red" />
            </Pressable>
          ),
          animation: 'default',
        }}
      />
      <ScrollView>
        {/* Render active tasks */}
        {taskList.map((item: TaskItemType) => (
          <TaskItem key={item.id} item={item} listId={listItem} arrayType="completed" />
        ))}
        {completedTaskList.length > 0 ? (
          <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)}>
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

            {completedTasksVisibility
              ? completedTaskList.map((item: TaskItemType) => (
                  <TaskItem key={item.id} item={item} listId={listItem} arrayType="uncompleted" />
                ))
              : null}
          </Animated.View>
        ) : null}
      </ScrollView>
      <View className="m-2 h-14 flex-row items-center justify-between rounded-2xl bg-white/10 px-2">
        <TextInput
          value={input}
          maxLength={250}
          onChangeText={(text) => setInput(text)}
          className="flex-1 text-white"
        />
        <MaterialCommunityIcons
          onPress={() => {
            if (input.length === 0) return;
            addItem(listItem);
          }}
          name="arrow-up-box"
          size={35}
          color="white"
        />
      </View>
    </View>
  );
}
