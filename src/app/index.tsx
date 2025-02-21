import { Link } from 'expo-router';

import Timer from '~/src/components/Timer';

export default function Home() {
  return (
    <>
      <Timer />
      <Link href="/list">Go to About screen</Link>
      <Link href="/settings">Go to Settings screen</Link>
    </>
  );
}
