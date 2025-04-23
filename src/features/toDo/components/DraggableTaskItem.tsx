import React, { useRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dimensions, Pressable, Text, TextInput, View } from 'react-native';
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

export default function DraggableTaskItem({
  item,
  arrayType,
  listId,
  order,
  onOrderChange,
}: Props) {
  const swipeableRef = useRef<any>();
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
  const offsetY = useSharedValue(order.value.indexOf(id) * ITEM_HEIGHT);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      const idx = order.value.indexOf(id);
      ctx.startY = idx * ITEM_HEIGHT;
      ctx.lastIndex = idx;
      offsetY.value = idx * ITEM_HEIGHT;
      isDragging.value = true;
    },
    onActive: (evt, ctx: any) => {
      offsetY.value = ctx.startY + evt.translationY;
      const newIndex = Math.floor(offsetY.value / ITEM_HEIGHT);
      const currIndex = order.value.indexOf(id);
      if (newIndex !== ctx.lastIndex && newIndex >= 0 && newIndex < order.value.length) {
        order.value = swap(order.value, currIndex, newIndex);
        ctx.lastIndex = newIndex;
      }
    },
    onEnd: () => {
      const finalIdx = order.value.indexOf(id);
      offsetY.value = withSpring(finalIdx * ITEM_HEIGHT, { damping: 20, stiffness: 150 }, () =>
        runOnJS(onOrderChange)(listId, order.value)
      );
      isDragging.value = false;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const idx = order.value.indexOf(id);
    return {
      position: 'absolute',
      top: isDragging.value
        ? offsetY.value
        : withSpring(idx * ITEM_HEIGHT, { damping: 20, stiffness: 150 }),
      left: 0,
      right: 0,
      zIndex: isDragging.value ? 1 : 0,
    };
  });

  return (
    <Animated.View entering={FadeIn.duration(500)} style={animatedStyle}>
      <Swipeable
        ref={swipeableRef}
        simultaneousHandlers={panRef}
        renderRightActions={RightAction}
        onSwipeableOpen={() =>
          arrayType === 'completed' ? deleteItem(listId, id) : deleteItemFromCompleted(listId, id)
        }>
        <View className="relative my-0.5 h-20 flex-row items-center px-3">
          <Pressable
            onLongPress={() => editItem(listId, id)}
            onPress={() => {
              if (arrayType === 'completed') {
                moveToCompleted(listId, id);
                deleteItem(listId, id);
              } else {
                moveToList(listId, id);
                deleteItemFromCompleted(listId, id);
              }
            }}
            className="flex-1 flex-row items-center gap-x-2">
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
                onBlur={() => finistEditingItem(listId, id)}
                autoFocus
              />
            ) : (
              <Text className="text-2xl text-[#E0E0E0]">{item.text}</Text>
            )}
          </Pressable>

          {/* Drag handle only */}
          <PanGestureHandler
            ref={panRef}
            onGestureEvent={gestureHandler}
            simultaneousHandlers={swipeableRef}>
            <Animated.View className="p-2">
              <MaterialCommunityIcons name="drag" size={35} color="#888" />
            </Animated.View>
          </PanGestureHandler>
        </View>
      </Swipeable>
    </Animated.View>
  );
}

const RightAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
  const screenWidth = Dimensions.get('window').width;
  const style = useAnimatedStyle(() => ({
    backgroundColor: prog.value >= 0.5 ? 'red' : '#ef4444',
    transform: [{ translateX: drag.value + screenWidth }],
  }));
  return (
    <Animated.View className="my-0.5 h-20 w-screen justify-center rounded-lg px-5" style={style}>
      <MaterialCommunityIcons name="trash-can-outline" size={35} color="white" />
    </Animated.View>
  );
};
