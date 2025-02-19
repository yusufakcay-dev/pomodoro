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
  const [array, setArray] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);
  const [editInput, setEditInput] = useState('');
  const [edit, setEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  const deleteItem = (id) => {
    const newArray = array.filter((filter) => filter.id !== id);
    setArray(newArray);
  };

  const deleteItemFromCompleted = (id) => {
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

  const editItem = (key) => {
    if (edit) return;
    setEdit(true);
    array[key].edit = true;
    setEditInput(array[key].text);
    setArray([...array]);
  };

  const finishEdit = (key) => {
    setEdit(false);
    array[key].text = editInput;
    array[key].edit = false;
    setEditInput('');
    setArray([...array]);
  };

  const moveToCompleted = (id) => {
    const completedItem = array.filter((filter) => filter.id === id)[0];
    setCompletedItems([...completedItems, completedItem]);
  };

  const removeToList = (id) => {
    const completedItem = completedItems.filter((filter) => filter.id === id)[0];
    setArray([...array, completedItem]);
  };

  function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + screenWidth }],
      };
    });

    return (
      <Reanimated.View
        className="my-0.5 h-20 w-screen justify-center rounded-lg bg-red-500 px-5"
        style={styleAnimation}>
        <MaterialCommunityIcons name="trash-can-outline" size={35} color="white" />
      </Reanimated.View>
    );
  }

  const Item = ({ title }) => (
    <Swipeable
      key={title.id}
      renderRightActions={RightAction}
      onSwipeableOpen={() => deleteItem(title.id)}>
      <Pressable
        onPress={() => {
          moveToCompleted(title.id);
          deleteItem(title.id);
        }}
        className="my-0.5 h-20 flex-row items-center gap-x-2 rounded-lg bg-[#212121] px-3">
        <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={35} color="#E0E0E0" />
        <Text className="text-2xl text-[#E0E0E0]">{title.text}</Text>
      </Pressable>
    </Swipeable>
  );

  return (
    <View className="flex-1 justify-between bg-[#080808]">
      <ScrollView className="">
        {array.map((item) => (
          <Item title={item} />
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
        {completedItems.map((item) => isOpen && <Item title={item} />)}
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
