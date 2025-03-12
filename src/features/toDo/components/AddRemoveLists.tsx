import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useMemo } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { TaskListsGroupsType, useTasksStore } from '../stores/TasksStore';

interface Props {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  setRenderItems: (value: boolean) => void;
  currentItemID: string;
  taskListsGroups: TaskListsGroupsType[];
}

function AddRemoveLists({
  modalVisible,
  setModalVisible,
  setRenderItems,
  currentItemID,
  taskListsGroups,
}: Props) {
  const { moveListOutOfGroup, moveListToGroup } = useTasksStore();

  // Get the current task list object
  const currentList = useMemo(
    () => taskListsGroups.find((x) => x.id === currentItemID),
    [taskListsGroups, currentItemID]
  );

  // Store the stable order of groups & lists
  const { groups, lists } = useMemo(() => {
    return {
      groups: currentList?.groups || [],
      lists: taskListsGroups.filter(({ type }) => type === 'list'),
    };
  }, [taskListsGroups, currentList]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
        setRenderItems(true);
      }}
      style={{ zIndex: 999 }}>
      <Pressable
        onPress={() => {
          setModalVisible(!modalVisible);
          setRenderItems(true);
        }}
        className="flex-1 justify-center">
        <View
          className="m-12 flex-1 gap-y-8 bg-white/10 p-10"
          onStartShouldSetResponder={() => true}>
          <Text className="text-2xl font-bold text-white">Select lists to add or remove</Text>
          <View className="gap-y-2">
            {/* Render Groups */}
            {groups.map((item) => (
              <View key={item.id} className="flex flex-row items-center justify-between">
                <Text className="text-2xl text-white">{item.name}</Text>
                <Pressable onPress={() => moveListOutOfGroup(item.id)}>
                  <FontAwesome6 name="check" size={35} color="white" />
                </Pressable>
              </View>
            ))}
            {/* Render Lists */}
            {lists.map((item) => {
              const isInGroup = groups.some((sub) => sub.id === item.id);
              return (
                <View key={item.id} className="flex flex-row items-center justify-between">
                  <Text className="text-2xl text-white">{item.name}</Text>
                  <Pressable
                    onPress={() =>
                      isInGroup
                        ? moveListOutOfGroup(item.id)
                        : moveListToGroup(item.id, currentItemID)
                    }>
                    <FontAwesome6 name={isInGroup ? 'check' : 'add'} size={35} color="white" />
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

export default AddRemoveLists;
