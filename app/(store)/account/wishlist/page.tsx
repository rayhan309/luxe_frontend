'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Box,
  Typography,
  Grid,
  Skeleton,
  Button,
} from '@mui/material';
import { FavoriteBorder } from '@mui/icons-material';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { productsAPI } from '@/lib/api/products';
import ProductCard from '@/components/product/ProductCard';
import { COLORS } from '@/lib/theme';

export default function WishlistPage() {
  const { items } = useWishlistStore();

  const { data, isLoading } = useQuery({
    queryKey: ['wishlist-products', items],
    queryFn: () => productsAPI.list({ ids: items.join(','), limit: 100 }),
    enabled: items.length > 0,
  });

  const products = data?.data?.data || [];

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
        My Wishlist
      </Typography>

      {items.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <FavoriteBorder sx={{ fontSize: 48, color: COLORS.gray[300] }} />
          <Typography variant="body2" sx={{ color: COLORS.muted }}>
            Your wishlist is empty.
          </Typography>
          <Button
            component={Link}
            href="/products"
            variant="outlined"
            sx={{ mt: 1, borderColor: COLORS.black, color: COLORS.black, borderRadius: 0, px: 4 }}
          >
            Explore Products
          </Button>
        </Box>
      ) : isLoading ? (
        <Grid container spacing={3}>
          {[...Array(items.length)].map((_, i) => (
            <Grid key={i} size={{ xs: 6, sm: 4 }}>
              <Skeleton variant="rectangular" sx={{ aspectRatio: '3/4', mb: 1 }} />
              <Skeleton width="60%" />
              <Skeleton width="40%" />
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: COLORS.muted }}>
            Failed to load wishlist items.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid key={product.id} size={{ xs: 6, sm: 4 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
