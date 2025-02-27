import React, { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { useTasksStore } from '../stores/TasksStore';

interface Props {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  name: 'list' | 'group';
}

function CreateModal({ modalVisible, setModalVisible, name }: Props) {
  const [input, setInput] = useState('');
  const { addList } = useTasksStore();
  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
      className="">
      <Pressable onPress={() => setModalVisible(false)} className="flex-1 justify-center">
        <View className="" onStartShouldSetResponder={() => true}>
          <View className="w-full gap-y-5 self-center bg-white/5 py-5">
            <Text className="ml-16 text-3xl text-white">Create a {name}</Text>
            <TextInput
              value={input}
              onChangeText={(e) => setInput(e)}
              className="mx-20 border-b-2 border-blue-500
            text-2xl text-white"
              placeholder={`Name this ${name}`}
              placeholderTextColor="white"
            />
            <View className="mx-10 flex-row gap-x-5 self-end">
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <Text className="text-2xl text-white">CANCEL</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  name === 'list'
                    ? addList({
                        id: new Date().getTime().toString(),
                        name: input,
                        type: 'list',
                        tasks: [],
                      })
                    : addList({
                        id: new Date().getTime().toString(),
                        name: input,
                        type: 'group',
                        groups: [
                          {
                            id: new Date().getTime().toString(),
                            name: 'l1',
                            type: 'list',
                            tasks: [
                              {
                                id: new Date().getTime().toString(),
                                text: 'state.input',
                                editing: false,
                              },
                            ],
                          },
                          {
                            id: new Date().getTime().toString(),
                            name: 'l2',
                            type: 'list',
                            tasks: [
                              {
                                id: new Date().getTime().toString(),
                                text: 'item1',
                                editing: false,
                              },
                              {
                                id: new Date().getTime().toString(),
                                text: 'item2',
                                editing: false,
                              },
                            ],
                          },
                        ],
                      })
                }>
                <Text className="text-2xl text-white">CREATE {name.toUpperCase()}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

export default CreateModal;
