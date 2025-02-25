import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from './storage';

export interface TaskItemType {
  id: string;
  text: string;
  editing: boolean;
}

interface TasksStoreType {
  input: string;
  editInput: string;
  tasks: TaskItemType[];
  completedTasks: TaskItemType[];
  completedTasksVisibility: boolean;
  editMode: boolean;
  setInput: (input: string) => void;
  setEditInput: (editInput: string) => void;
  setCompletedTasksVisibility: (completedTasksVisibility: boolean) => void;
  deleteItem: (id: string) => void;
  deleteItemFromCompleted: (id: string) => void;
  addItem: () => void;
  moveToCompleted: (id: string) => void;
  moveToList: (id: string) => void;
  editItem: (id: string) => void;
  finistEditingItem: (id: string) => void;
}

export const useTasksStore = create<TasksStoreType>()(
  persist(
    (set) => ({
      input: '',
      editInput: '',
      tasks: [],
      completedTasks: [],
      completedTasksVisibility: false,
      editMode: false,
      setInput: (newInput) => set({ input: newInput }),
      setEditInput: (newEditInput) => set({ editInput: newEditInput }),
      setCompletedTasksVisibility: (toogleCompletedTasksVisibility) =>
        set({ completedTasksVisibility: toogleCompletedTasksVisibility }),
      deleteItem: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
      deleteItemFromCompleted: (id) =>
        set((state) => ({ completedTasks: state.completedTasks.filter((task) => task.id !== id) })),
      addItem: () =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id: new Date().getTime().toString(), text: state.input, editing: false },
          ],
          input: '',
        })),
      moveToCompleted: (id) =>
        set((state) => ({
          completedTasks: [
            ...state.completedTasks,
            state.tasks.filter((filter) => filter.id === id)[0],
          ],
        })),
      moveToList: (id) =>
        set((state) => ({
          tasks: [...state.tasks, state.completedTasks.filter((filter) => filter.id === id)[0]],
        })),
      editItem: (id) =>
        set((state) => ({
          editMode: true,
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, editing: true } : task)),
          editInput: state.tasks.find((task) => task.id === id)?.text || '',
        })),
      finistEditingItem: (id) =>
        set((state) => ({
          editMode: false,
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, editing: false, text: state.editInput } : task
          ),
          editInput: '',
        })),
    }),

    {
      name: 'tasks-storage', // Key for MMKV
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
