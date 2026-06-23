'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useAuthStore } from '@/lib/store/authStore';
import { authAPI } from '@/lib/api/auth';
import { COLORS } from '@/lib/theme';
import type { Address } from '@/types';

const schema = z.object({
  label: z.string().min(1, 'Required'),
  full_name: z.string().min(2, 'Required'),
  phone: z.string().min(7, 'Required'),
  street: z.string().min(5, 'Required'),
  city: z.string().min(2, 'Required'),
  state: z.string().min(2, 'Required'),
  zip_code: z.string().min(3, 'Required'),
  country: z.string().min(2, 'Required'),
  is_default: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function AddressesPage() {
  const { user, updateUser } = useAuthStore();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const addresses = user?.addresses || [];

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleOpenAdd = () => {
    setEditingAddress(null);
    reset({
      label: 'Home',
      full_name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'United States',
      is_default: false,
    });
    setOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingAddress(addr);
    reset({
      label: addr.label,
      full_name: addr.full_name,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zip_code: addr.zip_code,
      country: addr.country,
      is_default: addr.is_default,
    });
    setOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    try {
      let res;
      if (editingAddress?.id) {
        res = await authAPI.updateAddress(editingAddress.id, data);
        enqueueSnackbar('Address updated successfully!', { variant: 'success' });
      } else {
        res = await authAPI.addAddress(data);
        enqueueSnackbar('Address added successfully!', { variant: 'success' });
      }
      
      // Update profile data in store
      if (res.data.success) {
        // Fetch fresh profile since backend returns updated user or handles updates
        const profileRes = await authAPI.getProfile();
        updateUser(profileRes.data.data);
      }
      setOpen(false);
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.error || 'Failed to save address', { variant: 'error' });
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await authAPI.deleteAddress(addressId);
      enqueueSnackbar('Address deleted successfully!', { variant: 'success' });
      const profileRes = await authAPI.getProfile();
      updateUser(profileRes.data.data);
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.error || 'Failed to delete address', { variant: 'error' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '1.5rem',
            letterSpacing: '0.05em',
            fontWeight: 400,
          }}
        >
          My Addresses
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleOpenAdd}
          sx={{ borderColor: COLORS.black, color: COLORS.black, borderRadius: 0, fontSize: '0.75rem', letterSpacing: '0.08em' }}
        >
          Add Address
        </Button>
      </Box>

      {addresses.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: COLORS.muted }}>
            You haven't saved any addresses yet.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {addresses.map((addr) => (
            <Grid key={addr.id} size={{ xs: 12, sm: 6 }}>
              <Card variant="outlined" sx={{ borderRadius: 0, borderColor: COLORS.gray[200], height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {addr.label}
                    </Typography>
                    {addr.is_default && (
                      <Typography variant="caption" sx={{ color: COLORS.gold, fontWeight: 600, letterSpacing: '0.05em' }}>
                        DEFAULT
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>{addr.full_name}</Typography>
                  <Typography variant="caption" sx={{ color: COLORS.muted, display: 'block', mb: 0.5 }}>
                    {addr.street}, {addr.city}, {addr.state} {addr.zip_code}, {addr.country}
                  </Typography>
                  <Typography variant="caption" sx={{ color: COLORS.muted, display: 'block' }}>
                    Phone: {addr.phone}
                  </Typography>
                </CardContent>
                <CardActions sx={{ borderTop: `1px solid ${COLORS.gray[100]}`, px: 2, justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton size="small" onClick={() => handleOpenEdit(addr)} sx={{ color: COLORS.gray[600] }}>
                    <Edit sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => addr.id && handleDelete(addr.id)} sx={{ color: COLORS.gray[400], '&:hover': { color: COLORS.error } }}>
                    <Delete sx={{ fontSize: 16 }} />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Address Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 0 } } }}>
        <DialogTitle sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', fontWeight: 300 }}>
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Address Label (e.g. Home, Office)" {...register('label')} error={!!errors.label} helperText={errors.label?.message} id="addr-label" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Full Name" {...register('full_name')} error={!!errors.full_name} helperText={errors.full_name?.message} id="addr-name" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Phone Number" {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message} id="addr-phone" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Street Address" {...register('street')} error={!!errors.street} helperText={errors.street?.message} id="addr-street" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="City" {...register('city')} error={!!errors.city} helperText={errors.city?.message} id="addr-city" />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField fullWidth label="State" {...register('state')} error={!!errors.state} helperText={errors.state?.message} id="addr-state" />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField fullWidth label="ZIP Code" {...register('zip_code')} error={!!errors.zip_code} helperText={errors.zip_code?.message} id="addr-zip" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Country" {...register('country')} error={!!errors.country} helperText={errors.country?.message} id="addr-country" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={<Checkbox {...register('is_default')} defaultChecked={editingAddress?.is_default || false} sx={{ '&.Mui-checked': { color: COLORS.black } }} />}
                  label={<Typography variant="body2">Set as default address</Typography>}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpen(false)} sx={{ borderRadius: 0, color: COLORS.muted }}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ borderRadius: 0, backgroundColor: COLORS.black, color: COLORS.white }}>
              {isSubmitting ? <CircularProgress size={20} color="inherit" /> : editingAddress ? 'Update Address' : 'Add Address'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
