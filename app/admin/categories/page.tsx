'use client';

import React, { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Skeleton, FormControlLabel, Checkbox, Grid,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { categoriesAPI, type CreateCategoryInput } from '@/lib/api/categories';
import { COLORS } from '@/lib/theme';
import type { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, control, formState: { isSubmitting } } = useForm<CreateCategoryInput>({
    defaultValues: { name: '', description: '', is_active: true, sort_order: 0 },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => categoriesAPI.adminList(),
  });
  const categories = data?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: (d: CreateCategoryInput) => categoriesAPI.adminCreate(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-categories'] }); enqueueSnackbar('Category created', { variant: 'success' }); setOpen(false); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, d }: { id: string; d: Partial<CreateCategoryInput> }) => categoriesAPI.adminUpdate(id, d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-categories'] }); enqueueSnackbar('Category updated', { variant: 'success' }); setOpen(false); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesAPI.adminDelete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-categories'] }); enqueueSnackbar('Category deleted', { variant: 'success' }); },
  });

  const openDialog = (cat?: Category) => {
    setEditing(cat || null);
    reset(cat ? { name: cat.name, description: cat.description, is_active: cat.is_active, sort_order: cat.sort_order } : { name: '', description: '', is_active: true, sort_order: 0 });
    setOpen(true);
  };

  const onSubmit = (d: CreateCategoryInput) => {
    if (editing) updateMutation.mutate({ id: editing.id, d });
    else createMutation.mutate(d);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300 }}>Categories</Typography>
          <Typography variant="body2" sx={{ color: COLORS.muted }}>{categories.length} categories</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => openDialog()} sx={{ borderRadius: 0, backgroundColor: COLORS.black }}>
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${COLORS.gray[100]}`, borderRadius: 0 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: COLORS.gray[50] }}>
              {['Name', 'Slug', 'Sort', 'Status', 'Actions'].map((h) => (
                <TableCell key={h} sx={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: COLORS.muted }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? [...Array(4)].map((_, i) => (
              <TableRow key={i}>{[...Array(5)].map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}</TableRow>
            )) : categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{cat.name}</Typography></TableCell>
                <TableCell><Typography variant="caption" sx={{ color: COLORS.muted }}>{cat.slug}</Typography></TableCell>
                <TableCell>{cat.sort_order}</TableCell>
                <TableCell><Chip label={cat.is_active ? 'active' : 'inactive'} size="small" color={cat.is_active ? 'success' : 'default'} sx={{ borderRadius: 0, fontSize: '0.65rem' }} /></TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => openDialog(cat)}><Edit sx={{ fontSize: 16 }} /></IconButton>
                  <IconButton size="small" onClick={() => window.confirm('Delete?') && deleteMutation.mutate(cat.id)}><Delete sx={{ fontSize: 16 }} /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 0 } } }}>
        <DialogTitle sx={{ fontFamily: '"Cormorant Garamond", serif' }}>{editing ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} component="form" id="cat-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Name" {...register('name', { required: true })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth multiline rows={2} label="Description" {...register('description')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }} /></Grid>
            <Grid size={{ xs: 6 }}><TextField fullWidth type="number" label="Sort Order" {...register('sort_order', { valueAsNumber: true })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }} /></Grid>
            <Grid size={{ xs: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
              <Controller name="is_active" control={control} render={({ field }) => (
                <FormControlLabel control={<Checkbox checked={field.value} onChange={field.onChange} />} label="Active" />
              )} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ borderRadius: 0 }}>Cancel</Button>
          <Button type="submit" form="cat-form" variant="contained" disabled={isSubmitting} sx={{ borderRadius: 0, backgroundColor: COLORS.black }}>{editing ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
