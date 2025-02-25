import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

export const storage = new MMKV({ id: 'app-storage' });

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.delete(name);
  },
};

// const foo = [{ list: { name: '31', age: 22 }, list2: { name: '31', age: 22 } }];
// const foo = [{ list: [{ name: '31', age: 22 }], list2: { name: '31', age: 22 } }];
