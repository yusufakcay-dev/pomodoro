import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const ITEM_HEIGHT = 60;

// Swap function now works on an array of IDs.
const swap = (array, from, to) => {
  'worklet';
  const newArray = [...array];
  newArray.splice(to, 0, newArray.splice(from, 1)[0]);
  return newArray;
};

const DraggableItem = ({ item, onOrderChange, order }) => {
  const id = item.id;
  const isDragging = useSharedValue(false);

  // Function to get the current index from the shared order.
  const getIndex = () => order.value.indexOf(id);
  // Set offsetY based on the item's current position.
  const offsetY = useSharedValue(getIndex() * ITEM_HEIGHT);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      // Recalculate the current index on drag start.
      const currentIndex = order.value.indexOf(id);
      context.startY = currentIndex * ITEM_HEIGHT;
      offsetY.value = currentIndex * ITEM_HEIGHT;
      // Track the last index to debounce swap calls.
      context.lastIndex = currentIndex;
      isDragging.value = true;
    },
    onActive: (event, context) => {
      offsetY.value = context.startY + event.translationY;
      const newIndex = Math.floor(offsetY.value / ITEM_HEIGHT);
      const currentIndex = order.value.indexOf(id);
      // Only swap when a valid, new slot is reached.
      if (newIndex !== context.lastIndex && newIndex >= 0 && newIndex < order.value.length) {
        order.value = swap(order.value, currentIndex, newIndex);
        context.lastIndex = newIndex;
      }
    },
    onEnd: () => {
      const finalIndex = order.value.indexOf(id);
      // Snap the dragged item to its final position.
      offsetY.value = withSpring(finalIndex * ITEM_HEIGHT, { damping: 20, stiffness: 150 }, () => {
        // Update the state with the new order once the animation completes.
        runOnJS(onOrderChange)(order.value);
      });
      isDragging.value = false;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const currentIndex = order.value.indexOf(id);
    return {
      position: 'absolute',
      width: '100%',
      top: isDragging.value
        ? offsetY.value
        : withSpring(currentIndex * ITEM_HEIGHT, { damping: 20, stiffness: 150 }),
      zIndex: isDragging.value ? 1 : 0,
    };
  });

  return (
    <Animated.View style={[styles.item, animatedStyle]}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={styles.itemContent}>
          <Text>{item.text}</Text>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export default function Testing() {
  const [data, setData] = useState([
    { id: '1', text: 'Item 1' },
    { id: '2', text: 'Item 2' },
    { id: '3', text: 'Item 3' },
    { id: '4', text: 'Item 4' },
    { id: '5', text: 'Item 5' },
    { id: '6', text: 'Item 6' },
    { id: '7', text: 'Item 7' },
    { id: '8', text: 'Item 8' },
    { id: '9', text: 'Item 9' },
  ]);

  // Initialize shared order as an array of item IDs.
  const order = useSharedValue(data.map((item) => item.id));
  const onOrderChange = (newOrder) => {
    // Reorder the state based on the new order (which is an array of IDs).
    const newData = newOrder.map((orderId) => data.find((item) => item.id === orderId));
    setData(newData);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      {/* Use an absolute container for proper animation */}
      <View style={{ height: data.length * ITEM_HEIGHT }}>
        {data.map((item) => (
          <DraggableItem key={item.id} item={item} onOrderChange={onOrderChange} order={order} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  item: {
    height: ITEM_HEIGHT,
    marginVertical: 5,
    padding: 5,
  },
  itemContent: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
