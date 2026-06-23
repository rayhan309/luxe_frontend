'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { authAPI } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { COLORS } from '@/lib/theme';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const { setAuth } = useAuthStore();
  const { enqueueSnackbar } = useSnackbar();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authAPI.login(data);
      const { user, token } = res.data.data;
      setAuth(user, token);
      enqueueSnackbar(`Welcome back, ${user.first_name}!`, { variant: 'success' });
      router.push(user.role === 'admin' ? '/admin' : (redirect || '/account'));
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.error || 'Login failed', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 440, mx: 'auto', px: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Link href="/">
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '2.5rem',
                letterSpacing: '0.3em',
                color: COLORS.black,
                mb: 1,
              }}
            >
              LUXE
            </Typography>
          </Link>
          <Typography variant="overline" sx={{ color: COLORS.gold, letterSpacing: '0.15em' }}>
            Welcome Back
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2.5 }}
            id="login-email"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ mb: 1 }}
            id="login-password"
          />

          <Box sx={{ textAlign: 'right', mb: 3 }}>
            <Link href="/forgot-password">
              <Typography variant="caption" sx={{ color: COLORS.gold, letterSpacing: '0.05em', '&:hover': { textDecoration: 'underline' } }}>
                Forgot password?
              </Typography>
            </Link>
          </Box>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            id="login-submit"
            sx={{
              py: 2,
              backgroundColor: COLORS.black,
              color: COLORS.white,
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              mb: 3,
              '&:hover': { backgroundColor: COLORS.gray[800] },
            }}
          >
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
          </Button>

          <Divider sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ color: COLORS.gray[400], px: 2, letterSpacing: '0.08em' }}>
              NEW TO LUXE?
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            href="/register"
            sx={{
              borderColor: COLORS.gray[300],
              color: COLORS.black,
              py: 1.75,
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
            }}
          >
            Create Account
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
}
