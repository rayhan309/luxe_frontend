'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
  Skeleton,
  Pagination,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import ProductCard from '@/components/product/ProductCard';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { categoriesAPI } from '@/lib/api/categories';
import { productsAPI } from '@/lib/api/products';
import { COLORS } from '@/lib/theme';

interface CategoryClientProps {
  slug: string;
}

export default function CategoryClient({ slug }: CategoryClientProps) {
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: catData, isLoading: catLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoriesAPI.getBySlug(slug),
  });

  const category = catData?.data?.data;

  const { data, isLoading: productsLoading } = useQuery({
    queryKey: ['category-products', category?.id, page],
    queryFn: () => productsAPI.list({ category: category!.id, page, limit, sort: 'newest' }),
    enabled: !!category?.id,
  });

  const products = data?.data?.data || [];
  const meta = data?.data?.meta;
  const isLoading = catLoading || productsLoading;

  if (catLoading) {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 8 }, py: 8 }}>
        <Skeleton width="40%" height={60} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {[...Array(8)].map((_, i) => (
            <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
              <Skeleton variant="rectangular" sx={{ aspectRatio: '3/4', mb: 1 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (!category) {
    return (
      <Container maxWidth="xl" sx={{ py: 12, textAlign: 'center' }}>
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', mb: 2 }}>
          Category Not Found
        </Typography>
        <Typography sx={{ color: COLORS.muted }}>This collection may have been moved or discontinued.</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ pb: { xs: 8, md: 12 } }}>
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 8 },
          background: `linear-gradient(135deg, ${COLORS.black} 0%, #1A1A2E 100%)`,
          color: COLORS.white,
          textAlign: 'center',
        }}
      >
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Typography className="section-tag" sx={{ justifyContent: 'center', mb: 2, color: COLORS.gold }}>
            Collection
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 300,
              fontSize: { xs: '2.5rem', md: '4rem' },
              letterSpacing: '0.06em',
              mb: 2,
            }}
          >
            {category.name}
          </Typography>
          {category.description && (
            <Typography sx={{ color: `${COLORS.white}99`, maxWidth: 560, mx: 'auto', lineHeight: 1.8 }}>
              {category.description}
            </Typography>
          )}
        </motion.div>
      </Box>

      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 8 }, pt: { xs: 6, md: 8 } }}>
        {isLoading ? (
          <Grid container spacing={3}>
            {[...Array(8)].map((_, i) => (
              <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
                <Skeleton variant="rectangular" sx={{ aspectRatio: '3/4' }} />
              </Grid>
            ))}
          </Grid>
        ) : products.length === 0 ? (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <Typography sx={{ color: COLORS.muted }}>No products in this collection yet.</Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {products.map((product, i) => (
                <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3 }}>
                  <ScrollReveal delay={i * 0.05}>
                    <ProductCard product={product} index={i} />
                  </ScrollReveal>
                </Grid>
              ))}
            </Grid>
            {(meta?.total_pages || 0) > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <Pagination
                  count={meta?.total_pages}
                  page={page}
                  onChange={(_, v) => setPage(v)}
                  sx={{ '& .MuiPaginationItem-root': { borderRadius: 0 } }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
