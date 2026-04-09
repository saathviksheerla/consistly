'use client';

import { useRouter } from 'next/navigation';

export function useNavigation() {
  const router = useRouter();

  const goToProfile = () => {
    router.push('/profile');
  };

  return { goToProfile };
}
