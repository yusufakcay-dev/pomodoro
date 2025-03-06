import React, { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { useTasksStore } from '../stores/TasksStore';

interface Props {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  mode: string;
  setRenderItems: (value: boolean) => void;
}

function CreateModal({ modalVisible, setModalVisible, mode, setRenderItems }: Props) {
  const [input, setInput] = useState('');
  const { addList } = useTasksStore();
  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
        setInput('');
      }}
      style={{ zIndex: 999 }}>
      <Pressable
        onPress={() => {
          setModalVisible(!modalVisible);
          setRenderItems(true);
          setInput('');
        }}
        className="flex-1 justify-center 
      ">
        <View className="" onStartShouldSetResponder={() => true}>
          <View className="w-full gap-y-5 self-center bg-white/5 py-5">
            <Text className="ml-16 text-3xl text-white">Create a {mode}</Text>
            <TextInput
              autoFocus
              value={input}
              onChangeText={(e) => setInput(e)}
              className="mx-20 border-b-2 border-blue-500
            text-2xl text-white"
              placeholder={`Name this ${mode}`}
              placeholderTextColor="white"
            />
            <View className="mx-10 flex-row gap-x-5 self-end">
              <Pressable
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setRenderItems(true);
                  setInput('');
                }}>
                <Text className="text-2xl text-white">CANCEL</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (mode === 'list') {
                    addList({
                      id: new Date().getTime().toString(),
                      name: input,
                      offSet: 0,
                      type: 'list',
                      tasks: [],
                      completedTasks: [],
                    });
                  } else {
                    addList({
                      id: new Date().getTime().toString() + '3e3wd3we1',
                      name: input,
                      offSet: 0,
                      type: 'group',
                      groups: [],
                    });
                  }
                  setModalVisible(!modalVisible);
                  setRenderItems(true);
                  setInput('');
                }}>
                <Text className="text-2xl text-white">CREATE {mode.toUpperCase()}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

export default CreateModal;
