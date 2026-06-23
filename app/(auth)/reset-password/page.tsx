'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { authAPI } from '@/lib/api/auth';
import { COLORS } from '@/lib/theme';

const schema = z.object({
  new_password: z.string().min(8, 'At least 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

type FormData = z.infer<typeof schema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      enqueueSnackbar('Invalid or missing reset token', { variant: 'error' });
      return;
    }
    try {
      await authAPI.resetPassword(token, data.new_password);
      enqueueSnackbar('Password updated successfully', { variant: 'success' });
      router.push('/login');
    } catch {
      enqueueSnackbar('Reset failed. The link may have expired.', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 440, mx: 'auto', px: 3 }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Link href="/">
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', letterSpacing: '0.3em', color: COLORS.black, mb: 1 }}>
              LUXE
            </Typography>
          </Link>
          <Typography variant="overline" sx={{ color: COLORS.gold, letterSpacing: '0.15em' }}>
            New Password
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth label="New Password" type="password" {...register('new_password')} error={!!errors.new_password} helperText={errors.new_password?.message} sx={{ mb: 2.5 }} />
          <TextField fullWidth label="Confirm Password" type="password" {...register('confirm_password')} error={!!errors.confirm_password} helperText={errors.confirm_password?.message} sx={{ mb: 3 }} />
          <Button fullWidth type="submit" variant="contained" disabled={isSubmitting || !token} sx={{ py: 2, backgroundColor: COLORS.black, borderRadius: 0 }}>
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Update Password'}
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
