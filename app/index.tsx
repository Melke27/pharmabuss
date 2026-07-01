import { Redirect } from 'expo-router';
import { useUserStore } from '../store';

export default function Index() {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/login'} />;
}
