export const dynamic = 'force-dynamic';
import { Login } from '@gitroom/frontend/components/auth/login';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'BDQ Login',
  description: '',
};
export default async function Auth() {
  return <Login />;
}
