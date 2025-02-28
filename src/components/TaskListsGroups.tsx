import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { TaskListsGroupsType, useTasksStore } from '../stores/TasksStore';
import CreateModal from './CreateModal';
import { DraggableItem, ITEM_HEIGHT } from './DraggableItem';
import { useSharedValue } from 'react-native-reanimated';

function TaskListsGroups() {
  const [modalVisible, setModalVisible] = useState(false);

  const [creating, setCreating] = useState<'list' | 'group'>('list');
  const { taskListsGroups, setTaskListsGroups } = useTasksStore();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const order = useSharedValue(taskListsGroups.map((item) => item.id));

  const onOrderChange = (newOrder: any) => {
    // Reorder the state based on the new order (which is an array of IDs).
    const newData = newOrder.map((orderId: any) =>
      taskListsGroups.find((item) => item.id === orderId)
    );
    setTaskListsGroups(newData);
  };
  useEffect(() => {
    order.value = taskListsGroups.map((item) => item.id);
  }, [taskListsGroups]);

  const expandedGroupsSV = useSharedValue<Record<string, boolean>>({});
  useEffect(() => {
    expandedGroupsSV.value = expandedGroups;
  }, [expandedGroups]);

  const itemsMap = useMemo(() => {
    const map: Record<string, TaskListsGroupsType> = {};
    taskListsGroups.forEach((group) => {
      // Use the group as-is (assuming its type is already correct)
      map[group.id] = group;
      if (group.groups && group.groups.length > 0) {
        group.groups.forEach((subgroup) => {
          map[subgroup.id] = subgroup;
        });
      }
    });
    return map;
  }, [taskListsGroups]);

  return (
    <>
      <View className="relative flex-1 justify-between bg-black px-2">
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{ height: taskListsGroups.length * ITEM_HEIGHT }}>
            {taskListsGroups.map((item) => (
              <>
                {!modalVisible && (
                  <DraggableItem
                    key={item.id}
                    item={item}
                    onOrderChange={onOrderChange}
                    order={order}
                    itemsMap={itemsMap}
                    expandedGroups={expandedGroups}
                    setExpandedGroups={setExpandedGroups}
                  />
                )}
              </>
            ))}
          </View>
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
    </>
  );
}

export default TaskListsGroups;
