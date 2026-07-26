export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { Activate } from '@gitroom/frontend/components/auth/activate';
export const metadata: Metadata = {
  title: 'BDQ - Activate your account',
  description: '',
};
export default async function Auth() {
  return <Activate />;
}
