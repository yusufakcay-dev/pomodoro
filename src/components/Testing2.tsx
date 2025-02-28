import React, { useState } from 'react';
import { StyleSheet, Text, Dimensions, FlatList } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  LinearTransition,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 70;

// Sample data: 10 items with id and label
const initialData = Array.from({ length: 10 }).map((_, i) => ({
  id: i.toString(),
  label: `Item ${i}`,
}));

export default function Testing2() {
  const [data, setData] = useState(initialData);

  // Render each draggable item
  const renderItem = ({ item, index }) => (
    <DraggableItem item={item} index={index} data={data} setData={setData} />
  );

  return (
    <Animated.FlatList
      data={data}
      renderItem={renderItem}
      itemLayoutAnimation={LinearTransition}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
}

function DraggableItem({ item, index, data, setData }) {
  // Shared value to track vertical translation during the drag
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateY.value = context.startY + event.translationY;
    },
    onEnd: () => {
      // Calculate new index based on translation distance
      const movedDistance = translateY.value;
      let newIndex = index + Math.round(movedDistance / ITEM_HEIGHT);

      // Clamp newIndex within bounds
      if (newIndex < 0) newIndex = 0;
      if (newIndex >= data.length) newIndex = data.length - 1;

      // Reset the translation immediately (no animation)
      translateY.value = 0;

      // Update data order if the index has changed
      if (newIndex !== index) {
        runOnJS(reorder)(index, newIndex);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Function to reorder the data array
  const reorder = (from, to) => {
    const newData = [...data];
    const [movedItem] = newData.splice(from, 1);
    newData.splice(to, 0, movedItem);
    setData(newData);
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.item, animatedStyle]}>
        <Text style={styles.text}>{item.label}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  item: {
    height: ITEM_HEIGHT,
    width: width - 40,
    backgroundColor: 'lightblue',
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});
