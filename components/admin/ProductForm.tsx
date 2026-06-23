'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  IconButton,
  Alert,
} from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { productsAPI } from '@/lib/api/products';
import { categoriesAPI } from '@/lib/api/categories';
import { uploadAPI } from '@/lib/api/upload';
import { resolveMediaUrl } from '@/lib/utils/media';
import { COLORS } from '@/lib/theme';
import type { Product } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'At least 2 characters').max(200),
  description: z.string().min(1, 'Required'),
  short_desc: z.string().optional(),
  category_id: z.string().min(1, 'Select a category'),
  price: z.number().positive('Must be greater than 0'),
  compare_price: z.number().positive().optional(),
  sku: z.string().min(1, 'Required'),
  stock: z.number().int().min(0, 'Cannot be negative'),
  status: z.enum(['active', 'draft', 'inactive']),
  is_featured: z.boolean(),
  is_best_seller: z.boolean(),
  is_new_arrival: z.boolean(),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ProductFormDialogProps {
  product?: Product | null;
  onSuccess: () => void;
  formId?: string;
}

export default function ProductForm({ product, onSuccess, formId = 'product-form' }: ProductFormDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin-categories-select'],
    queryFn: () => categoriesAPI.adminList(),
  });

  const categories = categoriesData?.data?.data || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      short_desc: '',
      category_id: '',
      price: 0,
      compare_price: undefined,
      sku: '',
      stock: 0,
      status: 'active',
      is_featured: false,
      is_best_seller: false,
      is_new_arrival: false,
      tags: '',
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        short_desc: product.short_desc || '',
        category_id: product.category_id || product.category?.id || '',
        price: product.price,
        compare_price: product.compare_price,
        sku: product.sku,
        stock: product.stock,
        status: product.status,
        is_featured: product.is_featured,
        is_best_seller: product.is_best_seller,
        is_new_arrival: product.is_new_arrival,
        tags: product.tags?.join(', ') || '',
      });
      setImages(product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : []);
    } else {
      reset({
        name: '',
        description: '',
        short_desc: '',
        category_id: '',
        price: 0,
        compare_price: undefined,
        sku: '',
        stock: 0,
        status: 'active',
        is_featured: false,
        is_best_seller: false,
        is_new_arrival: false,
        tags: '',
      });
      setImages([]);
    }
  }, [product, reset]);

  const createMutation = useMutation({
    mutationFn: (data: Parameters<typeof productsAPI.adminCreate>[0]) => productsAPI.adminCreate(data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof productsAPI.adminUpdate>[1] }) =>
      productsAPI.adminUpdate(id, data),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const { data } = await uploadAPI.upload(file);
        uploaded.push(data.data.url);
      }
      setImages((prev) => [...prev, ...uploaded]);
      enqueueSnackbar(`${uploaded.length} image(s) uploaded`, { variant: 'success' });
    } catch {
      enqueueSnackbar('Image upload failed', { variant: 'error' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    if (images.length === 0) {
      enqueueSnackbar('Add at least one product image', { variant: 'warning' });
      return;
    }

    const payload = {
      name: data.name,
      description: data.description,
      short_desc: data.short_desc || undefined,
      category_id: data.category_id,
      price: data.price,
      compare_price: typeof data.compare_price === 'number' && data.compare_price > 0 ? data.compare_price : undefined,
      images,
      thumbnail: images[0],
      sku: data.sku,
      stock: data.stock,
      status: data.status,
      is_featured: data.is_featured,
      is_best_seller: data.is_best_seller,
      is_new_arrival: data.is_new_arrival,
      tags: data.tags
        ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : undefined,
    };

    try {
      if (product) {
        await updateMutation.mutateAsync({ id: product.id, data: payload });
        enqueueSnackbar('Product updated', { variant: 'success' });
      } else {
        await createMutation.mutateAsync(payload);
        enqueueSnackbar('Product created', { variant: 'success' });
      }
      onSuccess();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to save product';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

  const fieldSx = { '& .MuiOutlinedInput-root': { borderRadius: 0 } };

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit(onSubmit)}>
      {!categoriesLoading && categories.length === 0 && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 0 }}>
          No categories found. Create a category first (e.g. Women, Men) before adding products.
        </Alert>
      )}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            fullWidth
            label="Product Name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={fieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="SKU"
            {...register('sku')}
            error={!!errors.sku}
            helperText={errors.sku?.message}
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Short Description"
            {...register('short_desc')}
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            select
            label="Category"
            {...register('category_id')}
            error={!!errors.category_id}
            helperText={errors.category_id?.message}
            disabled={categoriesLoading}
            sx={fieldSx}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            fullWidth
            type="number"
            label="Price ($)"
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
            {...register('price', { valueAsNumber: true })}
            error={!!errors.price}
            helperText={errors.price?.message}
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            fullWidth
            type="number"
            label="Compare Price ($)"
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
            {...register('compare_price', { valueAsNumber: true })}
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            fullWidth
            type="number"
            label="Stock"
            slotProps={{ htmlInput: { min: 0 } }}
            {...register('stock', { valueAsNumber: true })}
            error={!!errors.stock}
            helperText={errors.stock?.message}
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            fullWidth
            select
            label="Status"
            {...register('status')}
            sx={fieldSx}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Tags (comma separated)"
            placeholder="luxury, summer, new"
            {...register('tags')}
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, pt: 1 }}>
            <Controller
              name="is_featured"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox checked={field.value} onChange={field.onChange} sx={{ color: COLORS.black }} />}
                  label="Featured"
                />
              )}
            />
            <Controller
              name="is_best_seller"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox checked={field.value} onChange={field.onChange} sx={{ color: COLORS.black }} />}
                  label="Best Seller"
                />
              )}
            />
            <Controller
              name="is_new_arrival"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox checked={field.value} onChange={field.onChange} sx={{ color: COLORS.black }} />}
                  label="New Arrival"
                />
              )}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="caption" sx={{ color: COLORS.muted, letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1, display: 'block' }}>
            Product Images *
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
            {images.map((url, index) => (
              <Box
                key={`${url}-${index}`}
                sx={{
                  position: 'relative',
                  width: 88,
                  height: 104,
                  border: `1px solid ${COLORS.gray[200]}`,
                  backgroundImage: `url(${resolveMediaUrl(url)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {index === 0 && (
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: COLORS.white,
                      fontSize: '0.55rem',
                      textAlign: 'center',
                      py: 0.25,
                    }}
                  >
                    THUMBNAIL
                  </Typography>
                )}
                <IconButton
                  size="small"
                  onClick={() => removeImage(index)}
                  sx={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    backgroundColor: COLORS.white,
                    width: 22,
                    height: 22,
                    '&:hover': { backgroundColor: COLORS.gray[100] },
                  }}
                >
                  <Close sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            ))}
          </Box>
          <Button
            component="label"
            variant="outlined"
            startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />}
            disabled={uploading}
            sx={{ borderRadius: 0, borderColor: COLORS.gray[300], color: COLORS.black }}
          >
            {uploading ? 'Uploading...' : 'Upload Images'}
            <input type="file" hidden accept="image/*" multiple onChange={handleImageUpload} />
          </Button>
        </Grid>
      </Grid>

      {(isSubmitting || createMutation.isPending || updateMutation.isPending) && (
        <Box sx={{ display: 'none' }} aria-hidden />
      )}
    </Box>
  );
}
