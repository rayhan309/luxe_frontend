'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Skeleton,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Search, Visibility } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import Link from 'next/link';
import { productsAPI } from '@/lib/api/products';
import { COLORS } from '@/lib/theme';
import ProductForm from '@/components/admin/ProductForm';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', search, page],
    queryFn: () => productsAPI.adminList({ search, page, limit: 20 }),
  });

  const products = data?.data?.data || [];
  const meta = data?.data?.meta;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsAPI.adminDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      enqueueSnackbar('Product deleted', { variant: 'success' });
    },
    onError: () => enqueueSnackbar('Delete failed', { variant: 'error' }),
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    handleDialogClose();
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300 }}>
            Products
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.muted }}>
            {meta?.total || 0} total products
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => { setEditingProduct(null); setDialogOpen(true); }}
          id="add-product-button"
          sx={{ borderRadius: 0, backgroundColor: COLORS.black, color: COLORS.white, py: 1.5, px: 3 }}
        >
          Add Product
        </Button>
      </Box>

      {/* Search */}
      <TextField
        size="small"
        placeholder="Search products..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18 }} /></InputAdornment>,
          },
        }}
        sx={{ mb: 3, width: 320, '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
        id="admin-product-search"
      />

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${COLORS.gray[100]}`, borderRadius: 0 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: COLORS.gray[50] }}>
              {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.7rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    color: COLORS.muted,
                    borderBottom: `1px solid ${COLORS.gray[100]}`,
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton variant="text" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : products.map((product: any) => (
                  <TableRow
                    key={product.id}
                    sx={{ '&:hover': { backgroundColor: COLORS.gray[50] }, transition: 'background 0.15s' }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 52,
                            backgroundColor: COLORS.gray[100],
                            flexShrink: 0,
                            backgroundImage: product.thumbnail ? `url(${product.thumbnail})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{product.name}</Typography>
                          <Typography variant="caption" sx={{ color: COLORS.muted }}>SKU: {product.sku}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: COLORS.muted }}>
                        {product.category?.name || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>${product.price.toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: product.stock <= 5 ? COLORS.error : COLORS.black }}
                      >
                        {product.stock}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.status}
                        size="small"
                        color={statusColor(product.status) as any}
                        sx={{ borderRadius: 0, fontSize: '0.65rem', height: 22 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View">
                          <IconButton component={Link} href={`/products/${product.slug}`} size="small" target="_blank">
                            <Visibility sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => { setEditingProduct(product); setDialogOpen(true); }}
                          >
                            <Edit sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(product.id, product.name)}
                            sx={{ '&:hover': { color: COLORS.error } }}
                          >
                            <Delete sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Product Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 0 } } }}
      >
        <DialogTitle sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', fontWeight: 300 }}>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent dividers>
          {dialogOpen && (
            <ProductForm
              product={editingProduct}
              onSuccess={handleFormSuccess}
              formId="admin-product-form"
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleDialogClose} sx={{ borderRadius: 0 }}>Cancel</Button>
          <Button
            type="submit"
            form="admin-product-form"
            variant="contained"
            sx={{ borderRadius: 0, backgroundColor: COLORS.black }}
          >
            {editingProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
