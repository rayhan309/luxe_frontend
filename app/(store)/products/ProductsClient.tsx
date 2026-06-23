'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Drawer,
  Slider,
  Button,
  Chip,
  IconButton,
  Skeleton,
  Pagination,
  InputAdornment,
} from '@mui/material';
import { Search, FilterList, Close } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/product/ProductCard';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { productsAPI } from '@/lib/api/products';
import { COLORS } from '@/lib/theme';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [page, setPage] = useState(1);

  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const category = searchParams.get('category') || '';
  const limit = 12;

  const { data, isLoading } = useQuery({
    queryKey: ['products', { search, sort, category, page, priceRange }],
    queryFn: () =>
      productsAPI.list({
        search,
        sort: sort as any,
        category,
        page,
        limit,
        min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
        max_price: priceRange[1] < 2000 ? priceRange[1] : undefined,
      }),
  });

  const products = data?.data?.data || [];
  const meta = data?.data?.meta;

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`/products?${params.toString()}`);
    setPage(1);
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 8 } }}>
        {/* Header */}
        <ScrollReveal>
          <Box sx={{ mb: 6 }}>
            <Typography className="section-tag" sx={{ mb: 1 }}>
              {category ? category : 'All Products'}
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 300,
                letterSpacing: '-0.01em',
              }}
            >
              {search ? `Results for "${search}"` : 'The Collection'}
            </Typography>
            {meta && (
              <Typography variant="body2" sx={{ color: COLORS.muted, mt: 1 }}>
                {meta.total} pieces
              </Typography>
            )}
          </Box>
        </ScrollReveal>

        {/* Toolbar */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 4,
            flexWrap: 'wrap',
            alignItems: 'center',
            borderBottom: `1px solid ${COLORS.gray[100]}`,
            pb: 3,
          }}
        >
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search products..."
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateParam('search', (e.target as HTMLInputElement).value);
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 18, color: COLORS.gray[400] }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              flex: 1,
              minWidth: 200,
              maxWidth: 360,
              '& .MuiOutlinedInput-root': { borderRadius: 0 },
            }}
          />

          {/* Sort */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              sx={{ borderRadius: 0 }}
            >
              {SORT_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Filter Button */}
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFilterOpen(true)}
            sx={{ borderColor: COLORS.gray[300], color: COLORS.black, borderRadius: 0 }}
          >
            Filter
          </Button>

          {/* Active Filters */}
          {priceRange[0] > 0 || priceRange[1] < 2000 ? (
            <Chip
              label={`$${priceRange[0]} – $${priceRange[1]}`}
              onDelete={() => setPriceRange([0, 2000])}
              size="small"
              sx={{ borderRadius: 0, backgroundColor: COLORS.gray[100] }}
            />
          ) : null}
        </Box>

        {/* Grid */}
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <AnimatePresence mode="popLayout">
            {isLoading
              ? Array.from({ length: limit }).map((_, i) => (
                  <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
                    <Skeleton variant="rectangular" sx={{ aspectRatio: '3/4', mb: 1 }} />
                    <Skeleton width="60%" />
                    <Skeleton width="40%" />
                  </Grid>
                ))
              : products.map((product: any, i: number) => (
                  <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3 }}>
                    <ProductCard product={product} index={i} />
                  </Grid>
                ))}
          </AnimatePresence>
        </Grid>

        {/* Empty state */}
        {!isLoading && products.length === 0 && (
          <Box sx={{ py: 12, textAlign: 'center' }}>
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '2rem',
                color: COLORS.muted,
                mb: 2,
              }}
            >
              No products found
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.gray[400] }}>
              Try adjusting your search or filters
            </Typography>
          </Box>
        )}

        {/* Pagination */}
        {meta && meta.total_pages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Pagination
              count={meta.total_pages}
              page={page}
              onChange={(_, v) => {
                setPage(v);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 0,
                  '&.Mui-selected': {
                    backgroundColor: COLORS.black,
                    color: COLORS.white,
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        slotProps={{ paper: { sx: { width: 300, borderRadius: 0, p: 4 } } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem' }}>
            Filters
          </Typography>
          <IconButton onClick={() => setFilterOpen(false)} size="small">
            <Close />
          </IconButton>
        </Box>

        {/* Price Range */}
        <Typography variant="overline" sx={{ color: COLORS.gold, letterSpacing: '0.15em', mb: 2, display: 'block' }}>
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={(_, v) => setPriceRange(v as number[])}
          min={0}
          max={2000}
          step={10}
          sx={{
            color: COLORS.gold,
            '& .MuiSlider-thumb': { borderRadius: 0, width: 12, height: 12 },
            mb: 1,
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="body2">${priceRange[0]}</Typography>
          <Typography variant="body2">${priceRange[1]}</Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={() => setFilterOpen(false)}
          sx={{
            backgroundColor: COLORS.black,
            color: COLORS.white,
            borderRadius: 0,
            py: 1.5,
          }}
        >
          Apply Filters
        </Button>
        <Button
          fullWidth
          variant="text"
          onClick={() => {
            setPriceRange([0, 2000]);
            setFilterOpen(false);
          }}
          sx={{ mt: 1, color: COLORS.muted, borderRadius: 0 }}
        >
          Clear All
        </Button>
      </Drawer>
    </Box>
  );
}
