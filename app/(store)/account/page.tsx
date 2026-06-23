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
import { useAuthStore } from '@/lib/store/authStore';
import { authAPI } from '@/lib/api/auth';
import { COLORS } from '@/lib/theme';

const schema = z.object({
  first_name: z.string().min(2, 'At least 2 characters'),
  last_name: z.string().min(2, 'At least 2 characters'),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const { enqueueSnackbar } = useSnackbar();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authAPI.updateProfile(data);
      updateUser(res.data.data);
      enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.error || 'Failed to update profile', { variant: 'error' });
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
        Profile Information
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="First Name"
              {...register('first_name')}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
              id="profile-first-name"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Last Name"
              {...register('last_name')}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
              id="profile-last-name"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Email Address"
              value={user?.email || ''}
              disabled
              helperText="Email address cannot be changed."
              id="profile-email"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Phone Number"
              {...register('phone')}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              id="profile-phone"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              id="profile-submit"
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
              {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
