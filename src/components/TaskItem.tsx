import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dimensions, Pressable, Text, TextInput } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { TaskItemType, useTasksStore } from '../stores/TasksStore';

interface Props {
  item: TaskItemType;
  arrayType: 'completed' | 'uncompleted';
  listId: string;
}

function TaskItem({ item, arrayType, listId }: Props) {
  const {
    deleteItem,
    moveToCompleted,
    deleteItemFromCompleted,
    editInput,
    setEditInput,
    editItem,
    finistEditingItem,
    moveToList,
  } = useTasksStore();
  return (
    <Swipeable
      renderRightActions={RightAction}
      onSwipeableOpen={() =>
        arrayType === 'completed'
          ? deleteItem(listId, item.id)
          : deleteItemFromCompleted(listId, item.id)
      }>
      <Pressable
        onLongPress={() => editItem(listId, item.id)}
        className="my-0.5 h-20 flex-row items-center gap-x-2 px-3"
        onPress={() => {
          if (arrayType === 'completed') {
            moveToCompleted(listId, item.id);
            deleteItem(listId, item.id);
          } else {
            moveToList(listId, item.id);
            deleteItemFromCompleted(listId, item.id);
          }
        }}>
        <MaterialCommunityIcons
          name={
            arrayType === 'completed' ? 'checkbox-blank-circle-outline' : 'check-circle-outline'
          }
          size={35}
          color="#E0E0E0"
        />
        {item.editing ? (
          <TextInput
            className="flex-1 rounded-md bg-gray-700 p-1 text-2xl text-white"
            value={editInput}
            onChangeText={(text) => {
              setEditInput(text);
            }}
            onBlur={() => finistEditingItem(listId, item.id)}
            autoFocus
          />
        ) : (
          <Text className="text-2xl text-[#E0E0E0]">{item.text}</Text>
        )}
      </Pressable>
    </Swipeable>
  );
}
const RightAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
  const screenWidth = Dimensions.get('window').width;
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

export default TaskItem;
