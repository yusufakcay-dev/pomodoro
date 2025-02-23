import { Link } from 'expo-router';

import PomodoroTimer from '~/src/components/PomodoroTimer';

export default function Home() {
  return (
    <>
      <PomodoroTimer />
      {/* <Link href="/list">Go to About screen</Link> */}
      {/* <Link href="/settings">Go to Settings screen</Link> */}
    </>
  );
}
