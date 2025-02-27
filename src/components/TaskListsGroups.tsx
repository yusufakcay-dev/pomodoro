import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View, TouchableWithoutFeedback } from 'react-native';
import { useTasksStore } from '../stores/TasksStore';
import { Link, RelativePathString } from 'expo-router';
import CreateModal from './CreateModal';

function TaskListsGroups() {
  const [modalVisible, setModalVisible] = useState(false);
  const [creating, setCreating] = useState<'list' | 'group'>('list');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({}); // Track expanded groups
  const { taskListsGroups } = useTasksStore();

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId], // Toggle group expansion
    }));
  };

  return (
    <TouchableWithoutFeedback onPress={() => setOpenDropdown(null)} accessible={false}>
      <View className="flex-1 justify-between bg-black px-2">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          onScroll={() => setOpenDropdown(null)} // Close dropdown on scroll
        >
          {taskListsGroups.map((item) => (
            <View key={item.id} className="relative mb-4">
              {item.type === 'list' ? (
                <Link
                  href={{
                    pathname: `/${item.name}` as RelativePathString,
                    params: { tasks: JSON.stringify(item.tasks) },
                  }}>
                  <Text className="text-2xl text-white">{item.name}</Text>
                </Link>
              ) : (
                <View>
                  {/* Group Header */}
                  <View className="flex-row items-center justify-between">
                    <Text className="text-2xl text-white">{item.name}</Text>
                    <View className="relative flex-row">
                      {/* Dropdown Button */}
                      <Pressable
                        onPress={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}>
                        <MaterialCommunityIcons name="dots-vertical" size={35} color="white" />
                      </Pressable>

                      {/* Expand/Collapse Button */}
                      <Pressable onPress={() => toggleGroup(item.id)}>
                        <MaterialCommunityIcons
                          name={expandedGroups[item.id] ? 'chevron-down' : 'chevron-left'}
                          size={35}
                          color="white"
                        />
                      </Pressable>

                      {/* Dropdown Menu */}
                      {openDropdown === item.id && (
                        <View className="absolute right-0 top-10 z-50 min-w-[150px] max-w-xs rounded-lg bg-white p-2 shadow-lg">
                          <Pressable onPress={() => console.log('Change Name')}>
                            <Text className="py-2 text-lg text-black">Change Name</Text>
                          </Pressable>
                          <Pressable onPress={() => console.log('Delete')}>
                            <Text className="py-2 text-lg text-black">Delete</Text>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Render Lists Inside Group */}
                  {expandedGroups[item.id] && item.groups && (
                    <View className="ml-5 mt-2 border-l border-gray-500 pl-4">
                      {item.groups && item.groups.length > 0 ? (
                        item.groups.map((subItem) => (
                          <Link
                            key={subItem.id}
                            href={{
                              pathname: `/${subItem.name}` as RelativePathString,
                              params: { tasks: JSON.stringify(subItem.tasks) },
                            }}>
                            <Text className="text-xl text-white">{subItem.name}</Text>
                          </Link>
                        ))
                      ) : (
                        // Empty Group Message
                        <Text className="mt-2 text-2xl italic text-gray-400">
                          Drag or click to add item
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Create Modal */}
        <CreateModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          name={creating}
        />

        {/* Buttons */}
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
    </TouchableWithoutFeedback>
  );
}

export default TaskListsGroups;
