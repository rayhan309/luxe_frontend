'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { authAPI } from '@/lib/api/auth';
import { COLORS } from '@/lib/theme';

const schema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

type FormData = z.infer<typeof schema>;

export default function PasswordPage() {
  const { enqueueSnackbar } = useSnackbar();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await authAPI.changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      });
      enqueueSnackbar('Password changed successfully!', { variant: 'success' });
      reset();
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.error || 'Failed to change password', { variant: 'error' });
    }
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: '1.5rem',
          letterSpacing: '0.05em',
          mb: 4,
          fontWeight: 400,
        }}
      >
        Security & Password
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 480 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              {...register('current_password')}
              error={!!errors.current_password}
              helperText={errors.current_password?.message}
              id="pwd-current"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="password"
              label="New Password"
              {...register('new_password')}
              error={!!errors.new_password}
              helperText={errors.new_password?.message}
              id="pwd-new"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              {...register('confirm_password')}
              error={!!errors.confirm_password}
              helperText={errors.confirm_password?.message}
              id="pwd-confirm"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              id="password-submit"
              sx={{
                mt: 2,
                px: 5,
                py: 1.5,
                backgroundColor: COLORS.black,
                color: COLORS.white,
                borderRadius: 0,
                fontSize: '0.8rem',
                letterSpacing: '0.12em',
                '&:hover': { backgroundColor: COLORS.gray[800] },
              }}
            >
              {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Update Password'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
