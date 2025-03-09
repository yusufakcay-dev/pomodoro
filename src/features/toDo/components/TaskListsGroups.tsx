import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import AddRemoveLists from './AddRemoveLists';
import CreateModal from './CreateModal';
import { DraggableItem, ITEM_HEIGHT } from './DraggableItem';
import RenameModal from './RenameModal';
import { TaskListsGroupsType, useTasksStore } from '../stores/TasksStore';

function TaskListsGroups() {
  const [newItemModalVisible, setNewItemModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [addRemoveListsModalVisible, setAddRemoveListsModalVisible] = useState(false);
  const [renderItems, setRenderItems] = useState(true);
  const [renameInput, setRenameInput] = useState('');
  const [currentItemID, setCurrentItemID] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [creating, setCreating] = useState('list');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const expandedGroupsSV = useSharedValue(expandedGroups);
  const { taskListsGroups, setTaskListsGroups, deleteListGroup } = useTasksStore();
  const order = useSharedValue(taskListsGroups.map((item) => item.id));

  useEffect(() => {
    expandedGroupsSV.value = expandedGroups;
  }, [expandedGroups]);

  const onOrderChange = (newOrder: string[]): void => {
    // Reorder the state based on the new order (which is an array of IDs).
    const newData: TaskListsGroupsType[] = newOrder
      .map((orderId: string) => taskListsGroups.find((item) => item.id === orderId))
      .filter((item): item is TaskListsGroupsType => item !== undefined);
    setTaskListsGroups(newData);
  };

  useEffect(() => {
    order.value = taskListsGroups.map((item) => item.id);
  }, [taskListsGroups]);

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

  const containerHeight = useMemo(() => {
    return taskListsGroups.reduce((acc, group) => {
      let height = ITEM_HEIGHT;
      if (expandedGroups[group.id] && group.groups && group.groups.length > 0) {
        height += group.groups.length * ITEM_HEIGHT;
      }
      return acc + height;
    }, 0);
  }, [taskListsGroups, expandedGroups]);

  return (
    <View className="relative flex-1 justify-between bg-black px-2">
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ height: containerHeight }}>
          {taskListsGroups.map((item) =>
            renderItems ? (
              <DraggableItem
                key={item.id}
                item={item}
                onOrderChange={onOrderChange}
                order={order}
                itemsMap={itemsMap}
                expandedGroups={expandedGroups}
                setExpandedGroups={setExpandedGroups}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                setRenameModalVisible={setRenameModalVisible}
                setRenameInput={setRenameInput}
                setRenderItems={setRenderItems}
                setCurrentItemID={setCurrentItemID}
                deleteListGroup={deleteListGroup}
                setAddRemoveListsModalVisible={setAddRemoveListsModalVisible}
              />
            ) : null
          )}
        </View>
      </ScrollView>

      {/* Create Modal */}
      <CreateModal
        modalVisible={newItemModalVisible}
        setModalVisible={setNewItemModalVisible}
        mode={creating}
        setRenderItems={setRenderItems}
      />
      <RenameModal
        modalVisible={renameModalVisible}
        setModalVisible={setRenameModalVisible}
        renameInput={renameInput}
        setRenameInput={setRenameInput}
        setRenderItems={setRenderItems}
        currentItemID={currentItemID}
      />

      <AddRemoveLists
        modalVisible={addRemoveListsModalVisible}
        setModalVisible={setAddRemoveListsModalVisible}
        setRenderItems={setRenderItems}
        currentItemID={currentItemID}
        taskListsGroups={taskListsGroups}
      />

      {/* Buttons */}
      <View className="flex-row justify-between">
        <Pressable
          className="flex-row items-center gap-x-2"
          onPress={() => {
            setCreating('list');
            setNewItemModalVisible(!newItemModalVisible);
            setRenderItems(false);
          }}>
          <MaterialCommunityIcons name="plus" size={35} color="white" />
          <Text className="text-2xl text-white">New List</Text>
        </Pressable>
        <Pressable
          className="flex-row items-center gap-x-2"
          onPress={() => {
            setCreating('group');
            setNewItemModalVisible(!newItemModalVisible);
            setRenderItems(false);
          }}>
          <Text className="text-2xl text-white">New Group</Text>
          <MaterialCommunityIcons name="playlist-plus" size={35} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

export default TaskListsGroups;
