export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { AfterActivate } from '@gitroom/frontend/components/auth/after.activate';
export const metadata: Metadata = {
  title: 'BDQ - Activate your account',
  description: '',
};
export default async function Auth() {
  return <AfterActivate />;
}
