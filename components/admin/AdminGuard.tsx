'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthStore } from '@/lib/store/authStore';
import { COLORS } from '@/lib/theme';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, user, token } = useAuthStore();
  const router = useRouter();

  const ready = isAuthenticated || (!!user && !!token);

  useEffect(() => {
    if (!ready) {
      router.replace('/login?redirect=/admin');
      return;
    }
    if (!isAdmin) {
      router.replace('/account');
    }
  }, [ready, isAdmin, router]);

  if (!ready || !isAdmin) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <CircularProgress size={28} sx={{ color: COLORS.gold }} />
        <Typography variant="body2" sx={{ color: COLORS.muted, letterSpacing: '0.08em' }}>
          Verifying access...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
