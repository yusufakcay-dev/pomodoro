import { Text, StyleSheet, View, Pressable } from 'react-native';
import { Gesture, GestureDetector, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  useDerivedValue,
  Easing,
  withTiming,
  withDelay,
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
  openDropdown,
  setOpenDropdown,
  setRenameModalVisible,
  setRenameInput,
  setRenderItems,
  setCurrentItemID,
  deleteListGroup,
  setAddRemoveListsModalVisible,
}: any) => {
  const id = item.id;
  const isDragging = useSharedValue(false);
  // Function to get the current index from the shared order.

  //const getIndex = () => order.value.indexOf(id);

  const calculateTargetOffset = () => {
    'worklet';
    const currentIndex = order.value.indexOf(id);
    let extraOffset = 0;
    for (let i = 0; i < currentIndex; i++) {
      const precedingId = order.value[i];
      const precedingItem = itemsMap[precedingId];
      if (precedingItem && precedingItem.groups && expandedGroups[precedingId]) {
        if (precedingItem.groups.length < 2) {
          extraOffset += 120;
        } else extraOffset += precedingItem.groups.length * ITEM_HEIGHT;
      }
    }
    return currentIndex * ITEM_HEIGHT + extraOffset;
  };

  const getIndexForOffset = (offset: any) => {
    'worklet';
    let accumulatedOffset = 0;
    for (let i = 0; i < order.value.length; i++) {
      // Calculate the height for this item considering expanded groups.
      let itemHeight = ITEM_HEIGHT;
      const item = itemsMap[order.value[i]];
      if (item && item.groups && expandedGroups[item.id]) {
        itemHeight += item.groups.length * ITEM_HEIGHT;
      }
      // If the offset falls within this item's zone, return this index.
      if (offset < accumulatedOffset + itemHeight) {
        return i;
      }
      accumulatedOffset += itemHeight;
    }
    return order.value.length - 1;
  };

  // Set offsetY based on the item's current position.
  const offsetY: any = useDerivedValue(() => {
    return withSpring(calculateTargetOffset(), { damping: 20, stiffness: 150 });
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev: any) => {
      const newExpandedGroups = { ...prev };
      newExpandedGroups[groupId] = !newExpandedGroups[groupId];
      return newExpandedGroups;
    });
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      const currentIndex = order.value.indexOf(id);
      context.startY = calculateTargetOffset();
      context.lastIndex = currentIndex;
    },
    onActive: (event, context: any) => {
      const currentIndex = order.value.indexOf(id);
      offsetY.value = context.startY + event.translationY;
      isDragging.value = true;
      // Use the helper to get the new index based on the current offset.
      const newIndex = getIndexForOffset(offsetY.value);
      if (newIndex !== context.lastIndex && newIndex >= 0 && newIndex <= order.value.length) {
        context.lastIndex = newIndex;
        order.value = swap(order.value, currentIndex, newIndex);
      }
    },
    onEnd: () => {
      const finalIndex = order.value.indexOf(id);
      offsetY.value = withSpring(finalIndex * ITEM_HEIGHT, { damping: 20, stiffness: 150 }, () => {
        runOnJS(onOrderChange)(order.value);
      });
      isDragging.value = false;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    order.value.indexOf(id);
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
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.item, animatedStyle]}>
        <View>
          {item.type === 'list' ? (
            <Link
              href={{
                pathname: `/${item.id}` as RelativePathString,
                params: {
                  tasks: JSON.stringify(item.tasks),
                  completedTasks: JSON.stringify(item.completedTasks),
                },
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
                  {expandedGroups[item.id] && (
                    <Pressable
                      onPress={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}>
                      <MaterialCommunityIcons name="dots-vertical" size={35} color="white" />
                    </Pressable>
                  )}

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
                      <Pressable
                        onPress={() => {
                          setAddRemoveListsModalVisible(true);
                          setRenderItems(false);
                          setCurrentItemID(item.id);
                          setOpenDropdown(null);
                        }}>
                        <Text className="py-2 text-lg text-black">Add/Remove lists</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          setRenameInput(item.name);
                          setCurrentItemID(item.id);
                          setRenderItems(false);
                          setRenameModalVisible(true);
                          setOpenDropdown(null);
                        }}>
                        <Text className="py-2 text-lg text-black">Rename group</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          deleteListGroup(item.id);
                          setOpenDropdown(null);
                        }}>
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
                      <View className="h-[60px] justify-center">
                        <Link
                          href={{
                            pathname: `/${subItem.id}` as RelativePathString,
                            params: {
                              tasks: JSON.stringify(subItem.tasks),
                              completedTasks: JSON.stringify(subItem.completedTasks),
                            },
                          }}>
                          <Text className="text-2xl text-white">{subItem.name}</Text>
                        </Link>
                      </View>
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
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};
const styles = StyleSheet.create({
  item: {
    height: ITEM_HEIGHT,
    marginVertical: 5,
    padding: 5,
  },
});
