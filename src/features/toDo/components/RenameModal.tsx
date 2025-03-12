import { Modal, Pressable, Text, TextInput, View } from 'react-native';

import { useTasksStore } from '../stores/TasksStore';

interface Props {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  renameInput: string;
  setRenameInput: (value: string) => void;
  setRenderItems: (value: boolean) => void;
  currentItemID: string;
}

function RenameModal({
  modalVisible,
  setModalVisible,
  renameInput,
  setRenameInput,
  setRenderItems,
  currentItemID,
}: Props) {
  const { renameItem } = useTasksStore();
  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
        setRenderItems(true);
        setRenameInput('');
      }}
      style={{ zIndex: 999 }}>
      <Pressable
        onPress={() => {
          setModalVisible(!modalVisible);
          setRenderItems(true);
          setRenameInput('');
        }}
        className="flex-1 justify-center 
      ">
        <View className="" onStartShouldSetResponder={() => true}>
          <View className="w-full gap-y-5 self-center bg-white/5 py-5">
            <Text className="ml-16 text-3xl text-white">Rename group</Text>
            <TextInput
              autoFocus
              value={renameInput}
              onChangeText={(e) => setRenameInput(e)}
              className="mx-20 border-b-2 border-blue-500
            text-2xl text-white"
              placeholder="Rename this group"
              placeholderTextColor="white"
            />
            <View className="mx-10 flex-row gap-x-5 self-end">
              <Pressable
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setRenderItems(true);
                  setRenameInput('');
                }}>
                <Text className="text-2xl text-white">CANCEL</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  renameItem(currentItemID, renameInput);
                  setModalVisible(!modalVisible);
                  setRenderItems(true);
                  setRenameInput('');
                }}>
                <Text className="text-2xl text-white">RENAME</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

export default RenameModal;
