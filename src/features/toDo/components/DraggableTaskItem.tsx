import React, { useRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dimensions, Pressable, Text, TextInput } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  runOnJS,
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { TaskItemType, useTasksStore } from '../stores/TasksStore';
import { swap } from './DraggableItem';

interface Props {
  item: TaskItemType;
  arrayType: 'completed' | 'uncompleted';
  listId: string;
  order: SharedValue<string[]>;
  onOrderChange: (listId: string, newOrder: string[]) => void;
}

const ITEM_HEIGHT = 80;

function DraggableTaskItem({ item, arrayType, listId, order, onOrderChange }: Props) {
  // Create refs for both gesture handlers.
  const swipeableRef = useRef(null);
  const panRef = useRef(null);

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

  const id = item.id;
  const isDragging = useSharedValue(false);
  const getIndex = () => order.value.indexOf(id);
  const offsetY = useSharedValue(getIndex() * ITEM_HEIGHT);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      const currentIndex = order.value.indexOf(id);
      context.startY = currentIndex * ITEM_HEIGHT;
      offsetY.value = currentIndex * ITEM_HEIGHT;
      context.lastIndex = currentIndex;
      isDragging.value = true;
    },
    onActive: (event, context: any) => {
      offsetY.value = context.startY + event.translationY;
      const newIndex = Math.floor(offsetY.value / ITEM_HEIGHT);
      const currentIndex = order.value.indexOf(id);
      if (newIndex !== context.lastIndex && newIndex >= 0 && newIndex < order.value.length) {
        order.value = swap(order.value, currentIndex, newIndex);
        context.lastIndex = newIndex;
      }
    },
    onEnd: () => {
      const finalIndex = order.value.indexOf(id);
      offsetY.value = withSpring(finalIndex * ITEM_HEIGHT, { damping: 20, stiffness: 150 }, () => {
        runOnJS(onOrderChange)(listId, order.value);
      });
      isDragging.value = false;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const currentIndex = order.value.indexOf(id);
    return {
      top: isDragging.value
        ? offsetY.value
        : withSpring(currentIndex * ITEM_HEIGHT, { damping: 20, stiffness: 150 }),
      zIndex: isDragging.value ? 1 : 0,
      position: 'absolute',
      left: 0,
      right: 0,
    };
  });

  return (
    <PanGestureHandler
      ref={panRef}
      onGestureEvent={gestureHandler}
      simultaneousHandlers={swipeableRef}>
      <Animated.View entering={FadeIn.duration(500)} style={animatedStyle}>
        <Swipeable
          ref={swipeableRef}
          simultaneousHandlers={panRef}
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
                onChangeText={setEditInput}
                onBlur={() => finistEditingItem(listId, item.id)}
                autoFocus
              />
            ) : (
              <Text className="text-2xl text-[#E0E0E0]">{item.text}</Text>
            )}
          </Pressable>
        </Swipeable>
      </Animated.View>
    </PanGestureHandler>
  );
}

const RightAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
  const screenWidth = Dimensions.get('window').width;
  const styleAnimation = useAnimatedStyle(() => ({
    backgroundColor: prog.value >= 0.5 ? 'red' : '#ef4444',
    transform: [{ translateX: drag.value + screenWidth }],
  }));
  return (
    <Animated.View
      className="my-0.5 h-20 w-screen justify-center rounded-lg px-5"
      style={styleAnimation}>
      <MaterialCommunityIcons name="trash-can-outline" size={35} color="white" />
    </Animated.View>
  );
};

export default DraggableTaskItem;
