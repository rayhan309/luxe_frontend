'use client';

import React, { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Skeleton, MenuItem, Grid, FormControlLabel, Checkbox, CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete, CloudUpload } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { bannersAPI, type CreateBannerInput } from '@/lib/api/banners';
import { uploadAPI } from '@/lib/api/upload';
import { resolveMediaUrl } from '@/lib/utils/media';
import { COLORS } from '@/lib/theme';
import type { Banner } from '@/types';

export default function AdminBannersPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [uploading, setUploading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, control, setValue, watch } = useForm<CreateBannerInput>({
    defaultValues: { title: '', subtitle: '', image: '', position: 'hero', sort_order: 0, is_active: true, link: '/products', button_text: 'Shop Now' },
  });
  const imageUrl = watch('image');

  const { data, isLoading } = useQuery({ queryKey: ['admin-banners'], queryFn: () => bannersAPI.adminList() });
  const banners = data?.data?.data || [];

  const createMutation = useMutation({
    mutationFn: (d: CreateBannerInput) => bannersAPI.adminCreate(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-banners'] }); enqueueSnackbar('Banner created', { variant: 'success' }); setOpen(false); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, d }: { id: string; d: Partial<CreateBannerInput> }) => bannersAPI.adminUpdate(id, d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-banners'] }); enqueueSnackbar('Banner updated', { variant: 'success' }); setOpen(false); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => bannersAPI.adminDelete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-banners'] }); enqueueSnackbar('Deleted', { variant: 'success' }); },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await uploadAPI.upload(file);
      setValue('image', data.data.url);
      enqueueSnackbar('Image uploaded', { variant: 'success' });
    } catch {
      enqueueSnackbar('Upload failed', { variant: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const openDialog = (b?: Banner) => {
    setEditing(b || null);
    reset(b ? {
      title: b.title, subtitle: b.subtitle, image: b.image, position: b.position,
      sort_order: b.sort_order, is_active: b.is_active, link: b.link, button_text: b.button_text,
    } : { title: '', subtitle: '', image: '', position: 'hero', sort_order: 0, is_active: true, link: '/products', button_text: 'Shop Now' });
    setOpen(true);
  };

  const onSubmit = (d: CreateBannerInput) => {
    if (!d.image) { enqueueSnackbar('Upload an image', { variant: 'warning' }); return; }
    if (editing) updateMutation.mutate({ id: editing.id, d });
    else createMutation.mutate(d);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300 }}>Banners</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => openDialog()} sx={{ borderRadius: 0, backgroundColor: COLORS.black }}>Add Banner</Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${COLORS.gray[100]}`, borderRadius: 0 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: COLORS.gray[50] }}>
              {['Preview', 'Title', 'Position', 'Status', 'Actions'].map((h) => (
                <TableCell key={h} sx={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: COLORS.muted }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? [...Array(3)].map((_, i) => <TableRow key={i}>{[...Array(5)].map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}</TableRow>) :
              banners.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <Box sx={{ width: 80, height: 48, backgroundImage: `url(${resolveMediaUrl(b.image)})`, backgroundSize: 'cover', backgroundColor: COLORS.gray[100] }} />
                  </TableCell>
                  <TableCell>{b.title}</TableCell>
                  <TableCell><Chip label={b.position} size="small" sx={{ borderRadius: 0, fontSize: '0.65rem' }} /></TableCell>
                  <TableCell><Chip label={b.is_active ? 'active' : 'inactive'} size="small" color={b.is_active ? 'success' : 'default'} sx={{ borderRadius: 0, fontSize: '0.65rem' }} /></TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => openDialog(b)}><Edit sx={{ fontSize: 16 }} /></IconButton>
                    <IconButton size="small" onClick={() => window.confirm('Delete?') && deleteMutation.mutate(b.id)}><Delete sx={{ fontSize: 16 }} /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 0 } } }}>
        <DialogTitle sx={{ fontFamily: '"Cormorant Garamond", serif' }}>{editing ? 'Edit Banner' : 'Add Banner'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} component="form" id="banner-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Title" {...register('title', { required: true })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Subtitle" {...register('subtitle')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }} /></Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth select label="Position" {...register('position')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}>
                <MenuItem value="hero">Hero</MenuItem>
                <MenuItem value="mid">Mid</MenuItem>
                <MenuItem value="bottom">Bottom</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}><TextField fullWidth label="Link" {...register('link')} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }} /></Grid>
            <Grid size={{ xs: 12 }}>
              <Button component="label" variant="outlined" startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />} disabled={uploading} sx={{ borderRadius: 0, mb: 1 }}>
                Upload Image
                <input type="file" hidden accept="image/*" onChange={handleUpload} />
              </Button>
              {imageUrl && <Box sx={{ width: '100%', height: 100, backgroundImage: `url(${resolveMediaUrl(imageUrl)})`, backgroundSize: 'cover', mt: 1 }} />}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller name="is_active" control={control} render={({ field }) => (
                <FormControlLabel control={<Checkbox checked={field.value} onChange={field.onChange} />} label="Active" />
              )} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ borderRadius: 0 }}>Cancel</Button>
          <Button type="submit" form="banner-form" variant="contained" sx={{ borderRadius: 0, backgroundColor: COLORS.black }}>{editing ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
