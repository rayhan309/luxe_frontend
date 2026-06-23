'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { authAPI } from '@/lib/api/auth';
import { COLORS } from '@/lib/theme';

const schema = z.object({
  email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authAPI.forgotPassword(data.email);
      enqueueSnackbar('If an account exists, reset instructions have been sent.', { variant: 'success' });
      const token = res.data.data?.reset_token;
      if (token) {
        router.push(`/reset-password?token=${encodeURIComponent(token)}`);
      }
    } catch {
      enqueueSnackbar('Unable to process request. Please try again.', { variant: 'error' });
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
            Reset Password
          </Typography>
        </Box>

        <Typography sx={{ color: COLORS.muted, mb: 4, textAlign: 'center', lineHeight: 1.7 }}>
          Enter your email address and we will send you instructions to reset your password.
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth label="Email Address" type="email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} sx={{ mb: 3 }} />
          <Button fullWidth type="submit" variant="contained" disabled={isSubmitting} sx={{ py: 2, backgroundColor: COLORS.black, borderRadius: 0, mb: 2 }}>
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Send Reset Link'}
          </Button>
          <Button fullWidth component={Link} href="/login" sx={{ color: COLORS.muted, borderRadius: 0 }}>
            Back to Sign In
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
}
