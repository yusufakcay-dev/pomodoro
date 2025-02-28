import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from './storage';

export interface TaskItemType {
  id: string;
  text: string;
  editing: boolean;
}
export interface TaskListsGroupsType {
  id: string;
  name: string;
  type: 'list' | 'group';
  tasks?: TaskItemType[];
  groups?: TaskListsGroupsType[];
}

interface TasksStoreType {
  input: string;
  editInput: string;
  taskListsGroups: TaskListsGroupsType[];
  completedTasks: TaskItemType[];
  completedTasksVisibility: boolean;
  editMode: boolean;
  addList: (list: TaskListsGroupsType) => void;
  moveListToGroup: (listId: string, groupId: string) => void;
  moveListOutOfGroup: (listId: string) => void;
  setTaskListsGroups: (newOrder: TaskListsGroupsType[]) => void;
  // setInput: (input: string) => void;
  // setEditInput: (editInput: string) => void;
  // setCompletedTasksVisibility: (completedTasksVisibility: boolean) => void;
  // deleteItem: (id: string) => void;
  // deleteItemFromCompleted: (id: string) => void;
  // addItem: () => void;
  // moveToCompleted: (id: string) => void;
  // moveToList: (id: string) => void;
  // editItem: (id: string) => void;
  // finistEditingItem: (id: string) => void;
}

export const useTasksStore = create<TasksStoreType>()(
  persist(
    (set) => ({
      input: '',
      editInput: '',
      taskListsGroups: [],
      completedTasks: [],
      completedTasksVisibility: false,
      editMode: false,
      addList: (list) => set((state) => ({ taskListsGroups: [...state.taskListsGroups, list] })),
      setTaskListsGroups: (newOrder) => set({ taskListsGroups: newOrder }),
      moveListToGroup: (listId, groupId) => {
        set((state) => {
          let listToMove: TaskListsGroupsType | null = null;
          let updatedTaskLists = state.taskListsGroups.filter((list) => {
            if (list.id === listId) {
              listToMove = list;
              return false; // Remove the list from top-level
            }
            return true;
          });

          if (!listToMove) return state; // If list not found, do nothing

          updatedTaskLists = updatedTaskLists.map((group) => {
            if (group.id === groupId && group.type === 'group') {
              return {
                ...group,
                groups: [...(group.groups || []), listToMove!], // Add list to group
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
                  return false; // Remove from group
                }
                return true;
              });

              return { ...group, groups: filteredGroups };
            }
            return group;
          });

          if (listToMove) {
            updatedTaskLists.push(listToMove); // Move list to top level
          }

          return { taskListsGroups: updatedTaskLists };
        });
      },
    }),
    // setInput: (newInput) => set({ input: newInput }),
    // setEditInput: (newEditInput) => set({ editInput: newEditInput }),
    // setCompletedTasksVisibility: (toogleCompletedTasksVisibility) =>
    //   set({ completedTasksVisibility: toogleCompletedTasksVisibility }),
    // deleteItem: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
    // deleteItemFromCompleted: (id) =>
    //   set((state) => ({ completedTasks: state.completedTasks.filter((task) => task.id !== id) })),
    // addItem: () =>
    //   set((state) => ({
    //     tasks: [
    //       ...state.tasks,
    //       { id: new Date().getTime().toString(), text: state.input, editing: false },
    //     ],
    //     input: '',
    //   })),
    // moveToCompleted: (id) =>
    //   set((state) => ({
    //     completedTasks: [
    //       ...state.completedTasks,
    //       state.tasks.filter((filter) => filter.id === id)[0],
    //     ],
    //   })),
    // moveToList: (id) =>
    //   set((state) => ({
    //     tasks: [...state.tasks, state.completedTasks.filter((filter) => filter.id === id)[0]],
    //   })),
    // editItem: (id) =>
    //   set((state) => ({
    //     editMode: true,
    //     tasks: state.tasks.map((task) => (task.id === id ? { ...task, editing: true } : task)),
    //     editInput: state.tasks.find((task) => task.id === id)?.text || '',
    //   })),
    // finistEditingItem: (id) =>
    //   set((state) => ({
    //     editMode: false,
    //     tasks: state.tasks.map((task) =>
    //       task.id === id ? { ...task, editing: false, text: state.editInput } : task
    //     ),
    //     editInput: '',
    //   })),

    {
      name: 'tasks-storage2d231', // Key for MMKV
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
