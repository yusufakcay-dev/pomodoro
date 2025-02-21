import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
interface ToDoList {
  id: string;
  text: string;
  edit: boolean;
}

function ToDo() {
  const [input, setInput] = useState('');
  const [array, setArray] = useState<ToDoList[]>([]);
  const [completedItems, setCompletedItems] = useState<ToDoList[]>([]);
  const [editInput, setEditInput] = useState('');
  const [edit, setEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  const deleteItem = (id: string) => {
    const newArray = array.filter((filter) => filter.id !== id);
    setArray(newArray);
  };

  const deleteItemFromCompleted = (id: string) => {
    const newArray = completedItems.filter((filter) => filter.id !== id);
    setCompletedItems(newArray);
  };

  const addItem = () => {
    if (input.length < 1) return;
    const newValue = {
      id: new Date().getTime().toString(),
      text: input,
      edit: false,
    };
    setArray([...array, newValue]);
    setInput('');
  };

  const editItem = (key: number) => {
    if (edit) return;
    setEdit(true);
    array[key].edit = true;
    setEditInput(array[key].text);
    setArray([...array]);
  };

  const finishEdit = (key: number) => {
    setEdit(false);
    array[key].text = editInput;
    array[key].edit = false;
    setEditInput('');
    setArray([...array]);
  };

  const moveToCompleted = (id: string) => {
    const completedItem = array.filter((filter) => filter.id === id)[0];
    setCompletedItems([...completedItems, completedItem]);
  };

  const moveToList = (id: string) => {
    const completedItem = completedItems.filter((filter) => filter.id === id)[0];
    setArray([...array, completedItem]);
  };

  const RightAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => {
      if (prog.value >= 0.5) {
        return {
          backgroundColor: 'red',
          transform: [{ translateX: drag.value + screenWidth }],
        };
      } else {
        return {
          backgroundColor: '#ef4444',
          transform: [{ translateX: drag.value + screenWidth }],
        };
      }
    });

    return (
      <Reanimated.View
        className="my-0.5 h-20 w-screen justify-center rounded-lg px-5"
        style={styleAnimation}>
        <MaterialCommunityIcons name="trash-can-outline" size={35} color="white" />
      </Reanimated.View>
    );
  };

  const Item = ({ title, index, arrayType }: any) => (
    <Swipeable
      renderRightActions={RightAction}
      onSwipeableOpen={() => {
        if (arrayType === 'UnCompleted') {
          deleteItem(title.id);
        } else deleteItemFromCompleted(title.id);
      }}>
      <Pressable
        onLongPress={() => editItem(index)}
        className="my-0.5 h-20 flex-row items-center gap-x-2 rounded-lg bg-[#212121] px-3"
        onPress={() => {
          if (arrayType === 'UnCompleted') {
            moveToCompleted(title.id);
            deleteItem(title.id);
          } else {
            moveToList(title.id);
            deleteItemFromCompleted(title.id);
          }
        }}>
        <MaterialCommunityIcons
          name={
            arrayType === 'UnCompleted' ? 'checkbox-blank-circle-outline' : 'check-circle-outline'
          }
          size={35}
          color="#E0E0E0"
        />
        {title.edit ? (
          <TextInput
            className="flex-1 rounded-md bg-gray-700 p-1 text-2xl text-white"
            value={editInput}
            onChangeText={(text) => {
              setEditInput(text);
            }}
            onBlur={() => finishEdit(index)}
            autoFocus
          />
        ) : (
          <Text className="text-2xl text-[#E0E0E0]">{title.text}</Text>
        )}
      </Pressable>
    </Swipeable>
  );

  return (
    <View className="flex-1 justify-between bg-[#080808]">
      <ScrollView className="">
        {array.map((item, index) => (
          <Item key={item.id} title={item} index={index} arrayType="UnCompleted" />
        ))}
        <Pressable
          onPress={() => setIsOpen(!isOpen)}
          className="h-20 flex-row items-center rounded-lg px-3">
          <MaterialCommunityIcons
            name={isOpen ? 'chevron-down' : 'chevron-right'}
            size={35}
            color="white"
          />
          <Text className="text-2xl text-white">Completed</Text>
        </Pressable>
        {completedItems.map(
          (item, index) =>
            isOpen && <Item key={item.id} title={item} index={index} arrayType="Completed" />
        )}
      </ScrollView>
      <View className="h-14 flex-row items-center justify-between bg-white/10 px-3">
        <TextInput
          value={input}
          maxLength={250}
          onChangeText={(e) => {
            setInput(e);
            // console.log(array);
          }}
          className="flex-1 text-white"
        />
        <MaterialCommunityIcons
          onPress={() => addItem()}
          name="arrow-up-box"
          size={35}
          color="white"
        />
      </View>
    </View>
  );
}

export default ToDo;

/* <View className="flex-1">
        <FlatList
          data={array}
          renderItem={({ item }) => <Item title={item} />}
          keyExtractor={(item) => item.id}
        />
        <Pressable
          onPress={() => setIsOpen(!isOpen)}
          className="h-20 flex-row items-center rounded-lg px-3">
          <MaterialCommunityIcons
            name={isOpen ? 'chevron-down' : 'chevron-right'}
            size={24}
            color="white"
          />
          <Text className="text-2xl text-white">Completed</Text>
        </Pressable>
        {isOpen && (
          <FlatList
            data={completedItems}
            renderItem={({ item }) => <Item title={item} />}
            keyExtractor={(item) => item.id}
          />
        )}
      </View> */
