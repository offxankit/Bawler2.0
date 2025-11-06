'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OwnerSignup() {
  const router = useRouter();

  useEffect(() => {
    // Owner signup is disabled - redirect to login
    router.replace('/owner/login');
  }, [router]);

  return null;
}
