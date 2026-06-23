'use client';

import React from 'react';
import { Box, Typography, Container, Grid, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api/products';
import ProductCard from '@/components/product/ProductCard';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { COLORS } from '@/lib/theme';

interface ProductsSectionProps {
  title: string;
  tag: string;
  queryKey: string;
  fetcher: () => Promise<any>;
}

function ProductsSection({ title, tag, queryKey, fetcher }: ProductsSectionProps) {
  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: fetcher,
    staleTime: 5 * 60 * 1000,
  });

  const products = data?.data?.data || [];

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 8 } }}>
        <ScrollReveal>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography className="section-tag" sx={{ justifyContent: 'center', mb: 2 }}>
              {tag}
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 300,
                fontSize: { xs: '2.2rem', md: '3.5rem' },
                letterSpacing: '-0.01em',
                color: COLORS.black,
              }}
            >
              {title}
            </Typography>
          </Box>
        </ScrollReveal>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
                  <Skeleton variant="rectangular" sx={{ aspectRatio: '3/4', mb: 1 }} />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Grid>
              ))
            : products.slice(0, 8).map((product: any, i: number) => (
                <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3 }}>
                  <ProductCard product={product} index={i} />
                </Grid>
              ))}
        </Grid>
      </Container>
    </Box>
  );
}

export function FeaturedProducts() {
  return (
    <ProductsSection
      title="Featured Pieces"
      tag="Hand-Selected"
      queryKey="featured-products"
      fetcher={() => productsAPI.getFeatured()}
    />
  );
}

export function BestSellers() {
  return (
    <ProductsSection
      title="Best Sellers"
      tag="Most Loved"
      queryKey="best-sellers"
      fetcher={() => productsAPI.getBestSellers()}
    />
  );
}

export function NewArrivals() {
  return (
    <ProductsSection
      title="New Arrivals"
      tag="Just In"
      queryKey="new-arrivals"
      fetcher={() => productsAPI.getNewArrivals()}
    />
  );
}
