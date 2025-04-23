import { create } from 'zustand';

export interface TaskItemType {
  id: string;
  text: string;
  editing: boolean;
}

export interface TaskListsGroupsType {
  id: string;
  name: string;
  offSet: number;
  type: 'list' | 'group';
  tasks?: TaskItemType[];
  completedTasks?: TaskItemType[];
  groups?: TaskListsGroupsType[];
}

interface TasksStoreType {
  input: string;
  editInput: string;
  taskListsGroups: TaskListsGroupsType[];
  completedTasksVisibility: boolean;
  editMode: boolean;
  totalTaskDone: number;
  addList: (list: TaskListsGroupsType) => void;
  setInput: (newInput: string) => void;
  setEditInput: (newInput: string) => void;
  moveListToGroup: (listId: string, groupId: string) => void;
  moveListOutOfGroup: (listId: string) => void;
  deleteListGroup: (id: string) => void;
  setTaskListsGroups: (newOrder: TaskListsGroupsType[]) => void;
  // Updated signature: we include listId to know which list's tasks to replace
  setNewTasks: (listId: string, newTasks: TaskItemType[]) => void;
  renameItem: (id: string, newName: string) => void;
  // Task functions for a specific list
  deleteItem: (listId: string, taskId: string) => void;
  deleteItemFromCompleted: (listId: string, taskId: string) => void;
  moveToCompleted: (listId: string, taskId: string) => void;
  moveToList: (listId: string, taskId: string) => void;
  editItem: (listId: string, taskId: string) => void;
  finistEditingItem: (listId: string, taskId: string) => void;
  addItem: (listId: string) => void;
  renameListOrGroupName: (id: string, newName: string) => void;
}

export const useTasksStore = create<TasksStoreType>((set, get) => ({
  input: '',
  editInput: '',
  taskListsGroups: [],
  completedTasksVisibility: false,
  editMode: false,
  totalTaskDone: 0,

  // List/Group functions
  addList: (list) =>
    set((state) => ({
      taskListsGroups: [...state.taskListsGroups, list],
    })),
  setInput: (newInput) => set({ input: newInput }),
  setEditInput: (newInput) => set({ editInput: newInput }),
  setTaskListsGroups: (newOrder) => set({ taskListsGroups: newOrder }),

  // New function: Replaces the tasks array for a specific list
  setNewTasks: (listId, newTasks) =>
    set((state) => ({
      taskListsGroups: updateListInGroups(state.taskListsGroups, listId, (list) => ({
        ...list,
        tasks: newTasks,
      })),
    })),

  renameListOrGroupName: (id, newName) =>
    set((state) => ({
      taskListsGroups: updateListOrGroupName(state.taskListsGroups, id, newName),
    })),

  deleteListGroup: (id) =>
    set((state) => ({
      taskListsGroups: removeListOrGroup(state.taskListsGroups, id),
    })),
  moveListToGroup: (listId, groupId) => {
    set((state) => {
      let listToMove: TaskListsGroupsType | null = null;
      let updatedTaskLists = state.taskListsGroups.filter((list) => {
        if (list.id === listId) {
          listToMove = list;
          return false;
        }
        return true;
      });

      if (!listToMove) return state;

      updatedTaskLists = updatedTaskLists.map((group) => {
        if (group.id === groupId && group.type === 'group') {
          return {
            ...group,
            groups: [...(group.groups || []), listToMove!],
          };
        }
        return group;
      });

      return { taskListsGroups: updatedTaskLists };
    });
  },

  moveListOutOfGroup: (listId) => {
    set((state) => {
      let listToMove: TaskListsGroupsType | null = null;
      const updatedTaskLists = state.taskListsGroups.map((group) => {
        if (group.type === 'group' && group.groups) {
          const filteredGroups = group.groups.filter((list) => {
            if (list.id === listId) {
              listToMove = list;
              return false;
            }
            return true;
          });
          return { ...group, groups: filteredGroups };
        }
        return group;
      });
      if (listToMove) {
        updatedTaskLists.push(listToMove);
      }
      return { taskListsGroups: updatedTaskLists };
    });
  },

  renameItem: (id, newName) =>
    set((state) => ({
      taskListsGroups: state.taskListsGroups.map((item) =>
        item.id === id ? { ...item, name: newName } : item
      ),
    })),

  // Task functions for a specific list

  deleteItem: (listId, taskId) =>
    set((state) => ({
      taskListsGroups: updateListInGroups(state.taskListsGroups, listId, (list) => ({
        ...list,
        tasks: (list.tasks || []).filter((task) => task.id !== taskId),
      })),
    })),

  deleteItemFromCompleted: (listId, taskId) =>
    set((state) => ({
      taskListsGroups: updateListInGroups(state.taskListsGroups, listId, (list) => ({
        ...list,
        completedTasks: (list.completedTasks || []).filter((task) => task.id !== taskId),
      })),
    })),

  moveToCompleted: (listId, taskId) =>
    set((state) => {
      let movedTask: TaskItemType | undefined;
      const newTaskListsGroups = updateListInGroups(state.taskListsGroups, listId, (list) => {
        const newTasks = (list.tasks || []).filter((task) => {
          if (task.id === taskId) {
            movedTask = task;
            return false;
          }
          return true;
        });
        return {
          ...list,
          tasks: newTasks,
          completedTasks: [...(list.completedTasks || []), movedTask!],
        };
      });
      return {
        taskListsGroups: newTaskListsGroups,
        totalTaskDone: state.totalTaskDone + (movedTask ? 1 : 0),
      };
    }),

  moveToList: (listId, taskId) =>
    set((state) => {
      let movedTask: TaskItemType | undefined;
      const newTaskListsGroups = updateListInGroups(state.taskListsGroups, listId, (list) => {
        const newCompleted = (list.completedTasks || []).filter((task) => {
          if (task.id === taskId) {
            movedTask = task;
            return false;
          }
          return true;
        });
        return {
          ...list,
          completedTasks: newCompleted,
          tasks: [...(list.tasks || []), movedTask!],
        };
      });
      return {
        taskListsGroups: newTaskListsGroups,
        totalTaskDone: state.totalTaskDone - (movedTask ? 1 : 0),
      };
    }),

  editItem: (listId, taskId) =>
    set((state) => {
      let editText = '';
      const newTaskListsGroups = updateListInGroups(state.taskListsGroups, listId, (list) => {
        const newTasks = (list.tasks || []).map((task) => {
          if (task.id === taskId) {
            editText = task.text;
            return { ...task, editing: true };
          }
          return task;
        });
        return { ...list, tasks: newTasks };
      });
      return { taskListsGroups: newTaskListsGroups, editMode: true, editInput: editText };
    }),

  finistEditingItem: (listId, taskId) =>
    set((state) => ({
      taskListsGroups: updateListInGroups(state.taskListsGroups, listId, (list) => {
        const newTasks = (list.tasks || []).map((task) =>
          task.id === taskId ? { ...task, editing: false, text: state.editInput } : task
        );
        return { ...list, tasks: newTasks };
      }),
      editMode: false,
      editInput: '',
    })),

  addItem: (listId) =>
    set((state) => ({
      taskListsGroups: updateListInGroups(state.taskListsGroups, listId, (list) => ({
        ...list,
        tasks: [
          ...(list.tasks || []),
          { id: new Date().getTime().toString(), text: state.input, editing: false },
        ],
      })),
      input: '',
    })),
}));

function updateListInGroups(
  lists: TaskListsGroupsType[],
  listId: string,
  updater: (list: TaskListsGroupsType) => TaskListsGroupsType
): TaskListsGroupsType[] {
  return lists.map((item) => {
    if (item.type === 'list' && item.id === listId) {
      return updater(item);
    } else if (item.type === 'group' && item.groups) {
      return { ...item, groups: updateListInGroups(item.groups, listId, updater) };
    }
    return item;
  });
}

function removeListOrGroup(lists: TaskListsGroupsType[], id: string): TaskListsGroupsType[] {
  const result: TaskListsGroupsType[] = [];
  for (const item of lists) {
    if (item.id === id) {
      if (item.type === 'group' && item.groups && item.groups.length > 0) {
        result.push(...item.groups);
      }
    } else {
      if (item.type === 'group') {
        const updatedChildren = item.groups ? removeListOrGroup(item.groups, id) : [];
        result.push({ ...item, groups: updatedChildren });
      } else {
        result.push(item);
      }
    }
  }
  return result;
}

function updateListOrGroupName(
  lists: TaskListsGroupsType[],
  id: string,
  newName: string
): TaskListsGroupsType[] {
  return lists.map((item) => {
    if (item.id === id) {
      return { ...item, name: newName };
    } else if (item.type === 'group' && item.groups) {
      return {
        ...item,
        groups: updateListOrGroupName(item.groups, id, newName),
      };
    }
    return item;
  });
}
