import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function Page() {
  const { listItem, tasks } = useLocalSearchParams();
  const taskList = JSON.parse(tasks);
  console.log(listItem, taskList);
  taskList.push({ id: new Date().getTime().toString(), text: '62', editing: false });
  taskList.push({ id: new Date().getTime().toString(), text: 'hello', editing: false });

  console.log(taskList);
  return (
    <>
      {taskList.map((task) => (
        <Text>{task.text} </Text>
      ))}
    </>
  );
}
