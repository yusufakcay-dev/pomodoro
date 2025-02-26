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
//const foo = [{ list: [{ name: '31', age: 22 }], list2: { name: '31', age: 22 } }];
// interface xYp {
//   id: string;
//   text: string;
//   editing: boolean;
// }
// interface taskType {
//   id: string;
//   name: string;
//   type: string;
//   tasks: xYp[];
// }
// interface footype {
//   id: string;
//   name: string;
//   type: string;
//   tasks?: xYp[];
//   groups?: footype[];
// }

// const foo: footype[] = [
//   {
//     id: new Date().getTime().toString(),
//     name: 'list',
//     type: 'list',
//     tasks: [{ id: new Date().getTime().toString(), text: 'input', editing: false }],
//   },
//   {
//     id: new Date().getTime().toString(),
//     name: 'group',
//     type: 'group',
//     groups: [
//       {
//         id: new Date().getTime().toString(),
//         name: 'list',
//         type: 'list',
//         tasks: [{ id: new Date().getTime().toString(), text: 'input', editing: false }],
//       },
//       {
//         id: new Date().getTime().toString(),
//         name: 'list2',
//         type: 'list',
//         tasks: [{ id: new Date().getTime().toString(), text: 'input', editing: false }],
//       },
//     ],
//   },
// ];
// function getAllTasks(arr: any): any[] {
//   let tasks: any[] = [];

//   arr.forEach((item) => {
//     if (item.type === 'list' && item.tasks) {
//       tasks.push(...item.tasks);
//     }
//     if (item.type === 'group' && item.groups) {
//       tasks.push(...getAllTasks(item.groups)); // Recursive call
//     }
//   });

//   return tasks;
// }

// // Example usage:
// const allTasks = getAllTasks(foo);
// console.log(allTasks);
