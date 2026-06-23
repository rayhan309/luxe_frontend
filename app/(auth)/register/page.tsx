'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, TextField, Button, Typography, CircularProgress, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { authAPI } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { COLORS } from '@/lib/theme';

const schema = z.object({
  first_name: z.string().min(2, 'At least 2 characters'),
  last_name: z.string().min(2, 'At least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { enqueueSnackbar } = useSnackbar();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authAPI.register({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      });
      const { user, token } = res.data.data;
      setAuth(user, token);
      enqueueSnackbar(`Welcome to LUXE, ${user.first_name}!`, { variant: 'success' });
      router.push('/account');
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.error || 'Registration failed', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 520, mx: 'auto', px: 3 }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Link href="/">
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', letterSpacing: '0.3em', mb: 1 }}>
              LUXE
            </Typography>
          </Link>
          <Typography variant="overline" sx={{ color: COLORS.gold, letterSpacing: '0.15em' }}>
            Create Your Account
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="First Name" {...register('first_name')} error={!!errors.first_name} helperText={errors.first_name?.message} id="reg-first-name" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Last Name" {...register('last_name')} error={!!errors.last_name} helperText={errors.last_name?.message} id="reg-last-name" />
            </Grid>
          </Grid>
          <TextField fullWidth label="Email Address" type="email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} sx={{ mb: 2.5 }} id="reg-email" />
          <TextField fullWidth label="Password" type="password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} sx={{ mb: 2.5 }} id="reg-password" />
          <TextField fullWidth label="Confirm Password" type="password" {...register('confirm_password')} error={!!errors.confirm_password} helperText={errors.confirm_password?.message} sx={{ mb: 3 }} id="reg-confirm-password" />

          <Button
            fullWidth type="submit" variant="contained" disabled={isSubmitting} id="reg-submit"
            sx={{ py: 2, backgroundColor: COLORS.black, color: COLORS.white, fontSize: '0.8rem', letterSpacing: '0.15em', mb: 2, '&:hover': { backgroundColor: COLORS.gray[800] } }}
          >
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
          </Button>

          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: COLORS.muted }}>
            Already have an account?{' '}
            <Link href="/login"><span style={{ color: COLORS.gold }}>Sign in</span></Link>
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
}
