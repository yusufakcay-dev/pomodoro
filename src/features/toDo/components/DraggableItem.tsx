import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Link, RelativePathString } from 'expo-router';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  SharedValue,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

import { TaskListsGroupsType } from '../stores/TasksStore';

export const ITEM_HEIGHT = 60;

type DragContext = {
  startY: number;
  lastIndex: number;
};
interface Props {
  item: TaskListsGroupsType;
  onOrderChange: (newOrder: string[]) => void;
  order: SharedValue<string[]>;
  itemsMap: Record<string, TaskListsGroupsType>;
  expandedGroups: Record<string, boolean>;
  setExpandedGroups: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  openDropdown: string | null;
  setOpenDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  setRenameModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setRenameInput: React.Dispatch<React.SetStateAction<string>>;
  setRenderItems: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentItemID: React.Dispatch<React.SetStateAction<string>>;
  deleteListGroup: (id: string) => void;
  setAddRemoveListsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const swap = (array: string[], from: number, to: number) => {
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
}: Props) => {
  const id = item.id;
  const isDragging = useSharedValue(false);

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

  const offsetY = useSharedValue(calculateTargetOffset());

  const getIndexForOffset = (offset: number) => {
    'worklet';
    let bestIndex = 0;
    let smallestDiff = Number.MAX_VALUE;
    for (let i = 0; i < order.value.length; i++) {
      // Compute the target offset for this index using the same logic as calculateTargetOffset.
      let targetOffset = i * ITEM_HEIGHT;
      for (let j = 0; j < i; j++) {
        const precedingId = order.value[j];
        const precedingItem = itemsMap[precedingId];
        if (precedingItem && precedingItem.groups && expandedGroups[precedingId]) {
          targetOffset +=
            precedingItem.groups.length < 2 ? 120 : precedingItem.groups.length * ITEM_HEIGHT;
        }
      }
      const diff = Math.abs(offset - targetOffset);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        bestIndex = i;
      }
    }
    return bestIndex;
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev: Record<string, boolean>) => {
      const newExpandedGroups = { ...prev };
      newExpandedGroups[groupId] = !newExpandedGroups[groupId];
      return newExpandedGroups;
    });
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startY = calculateTargetOffset();
    },
    onActive: (event, context) => {
      const typedContext = context as DragContext;
      const currentIndex = order.value.indexOf(id);
      offsetY.value = typedContext.startY + event.translationY;
      isDragging.value = true;
      const newIndex = getIndexForOffset(offsetY.value);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < order.value.length) {
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
              <View className="flex-row items-center gap-x-2">
                <MaterialIcons name="format-list-bulleted" size={30} color="white" />
                <Text className="text-2xl text-white">{item.name}</Text>
              </View>
            </Link>
          ) : (
            <View>
              {/* Group Header */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-x-2">
                  <Text className="text-2xl text-white">{item.name}</Text>
                </View>
                <View className="relative flex-row">
                  {/* Dropdown Button */}
                  {expandedGroups[item.id] ? (
                    <Animated.View exiting={FadeOut.duration(500)} entering={FadeIn.duration(500)}>
                      <Pressable
                        onPress={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}>
                        <MaterialCommunityIcons name="dots-vertical" size={35} color="white" />
                      </Pressable>
                    </Animated.View>
                  ) : null}

                  {/* Expand/Collapse Button */}
                  <Pressable
                    onPress={() => {
                      setOpenDropdown(null);
                      toggleGroup(item.id);
                    }}>
                    <MaterialCommunityIcons
                      name={expandedGroups[item.id] ? 'chevron-down' : 'chevron-left'}
                      size={35}
                      color="white"
                    />
                  </Pressable>

                  {/* Dropdown Menu */}
                  {openDropdown === item.id ? (
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
                  ) : null}
                </View>
              </View>

              {/* Render Lists Inside Group */}
              {expandedGroups[item.id] && item.groups ? (
                <Animated.View
                  entering={FadeIn.duration(500)}
                  key={item.id}
                  className="ml-5 mt-2 border-l border-gray-500 pl-4">
                  {item.groups && item.groups.length > 0 ? (
                    item.groups.map((subItem: TaskListsGroupsType) => (
                      <View key={subItem.id} className="h-[60px] justify-center">
                        <Link
                          href={{
                            pathname: `/${subItem.id}` as RelativePathString,
                            params: {
                              tasks: JSON.stringify(subItem.tasks),
                              completedTasks: JSON.stringify(subItem.completedTasks),
                            },
                          }}>
                          <View className="flex-row items-center gap-x-2">
                            <MaterialIcons name="format-list-bulleted" size={30} color="white" />
                            <Text className="text-2xl text-white">{subItem.name}</Text>
                          </View>
                        </Link>
                      </View>
                    ))
                  ) : (
                    // Empty Group Message
                    <Text className="mt-2 text-2xl italic text-gray-400">
                      Drag or click to add item
                    </Text>
                  )}
                </Animated.View>
              ) : null}
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
