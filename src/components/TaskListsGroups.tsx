import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useTasksStore } from '../stores/TasksStore';
import { Link, RelativePathString } from 'expo-router';
import CreateModal from './CreateModal';
function TaskListsGroups() {
  const [modalVisible, setModalVisible] = useState(false);
  const [creating, setCreating] = useState<'list' | 'group'>('list');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { addList, taskListsGroups } = useTasksStore();

  return (
    <View className="flex-1 justify-between bg-black px-2">
      <ScrollView>
        {taskListsGroups.map((item) => (
          <View>
            {item.type === 'list' ? (
              <Link
                href={{
                  pathname: `/${item.name}` as RelativePathString,
                  params: { tasks: JSON.stringify(item.tasks) },
                }}>
                <Text className="text-2xl text-white">{item.name}</Text>
              </Link>
            ) : (
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl text-white">{item.name}</Text>
                </View>
                <View className="flex-row">
                  <View className="relative">
                    {' '}
                    {/* This ensures dropdown is positioned relative to this container */}
                    <Pressable
                      onPress={() =>
                        setOpenDropdown(openDropdown === item.name ? null : item.name)
                      }>
                      <MaterialCommunityIcons name="dots-vertical" size={35} color="white" />
                    </Pressable>
                    {openDropdown === item.name && (
                      <View className="absolute right-0 top-10 z-50 min-w-[150px] max-w-screen-sm rounded-lg bg-white p-2 shadow-lg">
                        <Pressable onPress={() => console.log('Change Name')}>
                          <Text className="break-words py-2 text-2xl text-black">Change Name</Text>
                        </Pressable>
                        <Pressable onPress={() => console.log('Delete')}>
                          <Text className="break-words py-2 text-2xl text-black">Delete</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                  <Pressable className="">
                    <MaterialCommunityIcons name="chevron-down" size={35} color="white" />
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <CreateModal modalVisible={modalVisible} setModalVisible={setModalVisible} name={creating} />
      <View className="flex-row justify-between">
        <Pressable
          className="flex-row gap-x-2"
          onPress={() => {
            setCreating('list');
            setModalVisible(!modalVisible);
          }}>
          <MaterialCommunityIcons name="plus" size={35} color="white" />
          <Text className="text-2xl text-white">New List</Text>
        </Pressable>
        <Pressable
          className="flex-row gap-x-2"
          onPress={() => {
            setCreating('group');
            setModalVisible(!modalVisible);
          }}>
          <Text className="text-2xl text-white">New Group</Text>
          <MaterialCommunityIcons name="playlist-plus" size={35} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

export default TaskListsGroups;
