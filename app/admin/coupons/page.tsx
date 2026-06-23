'use client';

import React, { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Skeleton, MenuItem, Grid, FormControlLabel, Checkbox,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { couponsAPI, type CreateCouponInput } from '@/lib/api/coupons';
import { COLORS } from '@/lib/theme';
import type { Coupon } from '@/types';

export default function AdminCouponsPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, control } = useForm<CreateCouponInput>({
    defaultValues: {
      code: '', discount_type: 'percentage', discount_value: 10, min_order_amount: 0,
      usage_limit: 0, is_active: true,
      starts_at: new Date().toISOString().slice(0, 16),
      expires_at: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16),
    },
  });

  const { data, isLoading } = useQuery({ queryKey: ['admin-coupons'], queryFn: () => couponsAPI.adminList() });
  const coupons = data?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: (d: CreateCouponInput) => couponsAPI.adminCreate(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-coupons'] }); enqueueSnackbar('Coupon created', { variant: 'success' }); setOpen(false); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, d }: { id: string; d: Partial<CreateCouponInput> }) => couponsAPI.adminUpdate(id, d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-coupons'] }); enqueueSnackbar('Coupon updated', { variant: 'success' }); setOpen(false); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => couponsAPI.adminDelete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-coupons'] }); enqueueSnackbar('Deleted', { variant: 'success' }); },
  });

  const openDialog = (c?: Coupon) => {
    setEditing(c || null);
    reset(c ? {
      code: c.code, description: c.description, discount_type: c.discount_type,
      discount_value: c.discount_value, min_order_amount: c.min_order_amount,
      usage_limit: c.usage_limit, is_active: c.is_active,
      starts_at: c.starts_at?.slice(0, 16), expires_at: c.expires_at?.slice(0, 16),
    } : {
      code: '', discount_type: 'percentage', discount_value: 10, min_order_amount: 0,
      usage_limit: 0, is_active: true,
      starts_at: new Date().toISOString().slice(0, 16),
      expires_at: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16),
    });
    setOpen(true);
  };

  const onSubmit = (d: CreateCouponInput) => {
    const payload = { ...d, starts_at: new Date(d.starts_at).toISOString(), expires_at: new Date(d.expires_at).toISOString() };
    if (editing) updateMutation.mutate({ id: editing.id, d: payload });
    else createMutation.mutate(payload);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300 }}>Coupons</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => openDialog()} sx={{ borderRadius: 0, backgroundColor: COLORS.black }}>Add Coupon</Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${COLORS.gray[100]}`, borderRadius: 0 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: COLORS.gray[50] }}>
              {['Code', 'Discount', 'Usage', 'Status', 'Expires', 'Actions'].map((h) => (
                <TableCell key={h} sx={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: COLORS.muted }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? [...Array(4)].map((_, i) => <TableRow key={i}>{[...Array(6)].map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}</TableRow>) :
              coupons.map((c) => (
                <TableRow key={c.id}>
                  <TableCell sx={{ fontWeight: 600 }}>{c.code}</TableCell>
                  <TableCell>{c.discount_type === 'percentage' ? `${c.discount_value}%` : `$${c.discount_value}`}</TableCell>
                  <TableCell>{c.used_count}/{c.usage_limit || '∞'}</TableCell>
                  <TableCell><Chip label={c.is_active ? 'active' : 'inactive'} size="small" color={c.is_active ? 'success' : 'default'} sx={{ borderRadius: 0, fontSize: '0.65rem' }} /></TableCell>
                  <TableCell><Typography variant="caption">{new Date(c.expires_at).toLocaleDateString()}</Typography></TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => openDialog(c)}><Edit sx={{ fontSize: 16 }} /></IconButton>
                    <IconButton size="small" onClick={() => window.confirm('Delete?') && deleteMutation.mutate(c.id)}><Delete sx={{ fontSize: 16 }} /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 0 } } }}>
        <DialogTitle sx={{ fontFamily: '"Cormorant Garamond", serif' }}>{editing ? 'Edit Coupon' : 'Add Coupon'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} component="form" id="coupon-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Code" {...register('code', { required: true })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth select label="Type" {...register('discount_type')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}>
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}><TextField fullWidth type="number" label="Value" {...register('discount_value', { valueAsNumber: true })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }} /></Grid>
            <Grid size={{ xs: 6 }}><TextField fullWidth type="number" label="Min Order" {...register('min_order_amount', { valueAsNumber: true })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }} /></Grid>
            <Grid size={{ xs: 6 }}><TextField fullWidth type="datetime-local" label="Starts" {...register('starts_at')} slotProps={{ inputLabel: { shrink: true } }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }} /></Grid>
            <Grid size={{ xs: 6 }}><TextField fullWidth type="datetime-local" label="Expires" {...register('expires_at')} slotProps={{ inputLabel: { shrink: true } }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }} /></Grid>
            <Grid size={{ xs: 12 }}>
              <Controller name="is_active" control={control} render={({ field }) => (
                <FormControlLabel control={<Checkbox checked={field.value} onChange={field.onChange} />} label="Active" />
              )} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ borderRadius: 0 }}>Cancel</Button>
          <Button type="submit" form="coupon-form" variant="contained" sx={{ borderRadius: 0, backgroundColor: COLORS.black }}>{editing ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
