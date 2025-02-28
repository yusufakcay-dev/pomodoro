import { Text, StyleSheet, View, Pressable } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Link, RelativePathString } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

export const ITEM_HEIGHT = 60;

const swap = (array: any, from: number, to: number) => {
  'worklet';
  const newArray = [...array];
  newArray.splice(to, 0, newArray.splice(from, 1)[0]);
  return newArray;
};

export const DraggableItem = ({
  item,
  onOrderChange,
  order,
  itemsMap,
  expandedGroups,
  setExpandedGroups,
}: any) => {
  const id = item.id;
  const isDragging = useSharedValue(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // Function to get the current index from the shared order.
  const getIndex = () => order.value.indexOf(id);
  // Set offsetY based on the item's current position.
  const calculateTargetOffset = () => {
    'worklet';
    const currentIndex = order.value.indexOf(id);
    let extraOffset = 0;
    // Loop over all items that come before this one
    for (let i = 0; i < currentIndex; i++) {
      const precedingId = order.value[i];
      const precedingItem = itemsMap[precedingId];
      // If this preceding item is an expanded group with children, add the extra offset.
      if (precedingItem && precedingItem.groups && expandedGroups[precedingId]) {
        extraOffset += precedingItem.groups.length * ITEM_HEIGHT;
      }
    }
    return currentIndex * ITEM_HEIGHT + extraOffset;
  };

  const offsetY = useSharedValue(calculateTargetOffset());
  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      // Check if the groupId exists and toggle its state
      const newExpandedGroups = { ...prev };
      newExpandedGroups[groupId] = !newExpandedGroups[groupId];
      return newExpandedGroups;
    });
  };

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
    onActive: (event, context: any) => {
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
    // (Assume calculateItemOffset is a helper that uses order.value, itemsMap, and expandedGroupsSV.value)
    const currentIndex = order.value.indexOf(id);
    // const targetOffset = calculateItemOffset(order.value, itemsMap, expandedGroups.value, id);
    return {
      position: 'absolute',
      width: '100%',
      top: isDragging.value
        ? offsetY.value
        : withSpring(calculateTargetOffset(), {
            damping: 20,
            stiffness: 150,
          }),
      zIndex: isDragging.value ? 1 : 0,
    };
  });

  return (
    <Animated.View style={[styles.item, animatedStyle]}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View>
          {item.type === 'list' ? (
            <Link
              href={{
                pathname: `/${item.name}` as RelativePathString,
                params: { tasks: JSON.stringify(item.tasks) },
              }}>
              <Text className="text-2xl text-white">{item.name}</Text>
            </Link>
          ) : (
            <View>
              {/* Group Header */}
              <View className="flex-row items-center justify-between">
                <Text className="text-2xl text-white">{item.name}</Text>
                <View className="relative flex-row">
                  {/* Dropdown Button */}
                  <Pressable
                    onPress={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}>
                    <MaterialCommunityIcons name="dots-vertical" size={35} color="white" />
                  </Pressable>

                  {/* Expand/Collapse Button */}
                  <Pressable onPress={() => toggleGroup(item.id)}>
                    <MaterialCommunityIcons
                      name={expandedGroups[item.id] ? 'chevron-down' : 'chevron-left'}
                      size={35}
                      color="white"
                    />
                  </Pressable>

                  {/* Dropdown Menu */}
                  {openDropdown === item.id && (
                    <View className="absolute right-0 top-10 z-50 min-w-[150px] max-w-xs rounded-lg bg-white p-2 shadow-lg">
                      <Pressable onPress={() => console.log('Change Name')}>
                        <Text className="py-2 text-lg text-black">Change Name</Text>
                      </Pressable>
                      <Pressable onPress={() => console.log('Delete')}>
                        <Text className="py-2 text-lg text-black">Delete</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>

              {/* Render Lists Inside Group */}
              {expandedGroups[item.id] && item.groups && (
                <View className="ml-5 mt-2 border-l border-gray-500 pl-4">
                  {item.groups && item.groups.length > 0 ? (
                    item.groups.map((subItem: any) => (
                      <Link
                        key={subItem.id}
                        href={{
                          pathname: `/${subItem.name}` as RelativePathString,
                          params: { tasks: JSON.stringify(subItem.tasks) },
                        }}>
                        <Text className="text-xl text-white">{subItem.name}</Text>
                      </Link>
                    ))
                  ) : (
                    // Empty Group Message
                    <Text className="mt-2 text-2xl italic text-gray-400">
                      Drag or click to add item
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  item: {
    height: ITEM_HEIGHT,
    marginVertical: 5,
    padding: 5,
  },
});
