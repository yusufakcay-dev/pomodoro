import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import TaskItem from '../components/TaskItem';
import { useTasksStore, TaskListsGroupsType, TaskItemType } from '../stores/TasksStore';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useSharedValue,
} from 'react-native-reanimated';
import DraggableTaskItem from './DraggableTaskItem';

// Recursive helper to search for a list by id within groups
function findListInGroups(lists: TaskListsGroupsType[], listId: string): TaskListsGroupsType {
  for (const item of lists) {
    if (item.type === 'list' && item.id === listId) {
      return item;
    } else if (item.type === 'group' && item.groups) {
      const found = findListInGroups(item.groups, listId);
      if (found) return found;
    }
  }
  throw new Error(`List with id ${listId} not found`);
}

export default function ListComponent() {
  const { listItem } = useLocalSearchParams<{ listItem: string }>();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [completedTasksVisibility, setCompletedTasksVisibility] = useState(false);
  const { taskListsGroups, addItem, input, setInput, setNewTasks } = useTasksStore();

  // Use the recursive helper to find the current list even if it is nested within groups.
  const currentList = findListInGroups(taskListsGroups, listItem);

  // Fallback to empty arrays if the list is not found.
  const taskList = currentList.tasks || [];
  const completedTaskList = currentList.completedTasks || [];

  const order = useSharedValue(taskList.map((item) => item.id));

  useEffect(() => {
    order.value = taskList.map((item) => item.id);
  }, [currentList]);

  const onOrderChange = (listId: string, newOrder: string[]): void => {
    // Reorder the state based on the new order (which is an array of IDs).
    const newData: TaskItemType[] = newOrder
      .map((orderId: string) => taskList.find((item) => item.id === orderId))
      .filter((item): item is TaskItemType => item !== undefined);
    setNewTasks(listId, newData);
  };

  const containerHeight = useMemo(() => {
    return (taskList.length ?? 0) * 80;
  }, [taskList.length]);

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
                // deleteListGroup(listItem);
                // router.back();
                setOpenDropdown(listItem);
              }}>
              <FontAwesome6 name="trash-can" size={24} color="red" />
            </Pressable>
          ),
          animation: 'default',
        }}
      />
      {openDropdown === listItem ? (
        <View className="absolute right-0 top-0 z-50 min-w-[150px] max-w-xs rounded-lg bg-white p-2 shadow-lg">
          <Pressable
            onPress={() => {
              setOpenDropdown(null);
            }}>
            <Text className="py-2 text-lg text-black">Add/Remove lists</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setOpenDropdown(null);
            }}>
            <Text className="py-2 text-lg text-black">Rename group</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setOpenDropdown(null);
            }}>
            <Text className="py-2 text-lg text-black">Delete</Text>
          </Pressable>
        </View>
      ) : null}
      <ScrollView className="">
        {/* Render active tasks */}
        <View style={{ height: containerHeight }}>
          {taskList.map((item: TaskItemType) => (
            <DraggableTaskItem
              key={item.id}
              item={item}
              listId={listItem}
              arrayType="completed"
              order={order}
              onOrderChange={onOrderChange}
            />
          ))}
        </View>
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
