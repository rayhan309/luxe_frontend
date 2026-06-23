'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Typography, Container, Grid, Skeleton } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { categoriesAPI } from '@/lib/api/categories';
import { COLORS } from '@/lib/theme';

const GRADIENTS = [
  { color: `linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)`, accent: '#D4A0C0' },
  { color: `linear-gradient(135deg, #0F2027 0%, #203A43 100%)`, accent: '#A0C4D4' },
  { color: `linear-gradient(135deg, #1C1C1C 0%, #2D2D2D 100%)`, accent: '#D4C4A0' },
  { color: `linear-gradient(135deg, #1A0F1C 0%, #2D1B35 100%)`, accent: '#C4A0D4' },
];

const FALLBACK = [
  { name: 'Women', slug: 'women', description: 'Effortless sophistication' },
  { name: 'Men', slug: 'men', description: 'Timeless refinement' },
  { name: 'Accessories', slug: 'accessories', description: 'The finishing touch' },
  { name: 'Lifestyle', slug: 'lifestyle', description: 'Curated living' },
];

type DisplayCategory = { name: string; slug: string; description: string; color: string; accent: string };

export default function CategoryShowcase() {
  const { data, isLoading } = useQuery({
    queryKey: ['categories-showcase'],
    queryFn: () => categoriesAPI.list(),
    staleTime: 5 * 60 * 1000,
  });

  const apiCategories = data?.data?.data?.filter((c) => c.is_active).slice(0, 4) || [];
  const categories: DisplayCategory[] = (apiCategories.length ? apiCategories : FALLBACK).map((cat, i) => ({
    name: cat.name,
    slug: cat.slug,
    description: cat.description || 'Explore the collection',
    ...GRADIENTS[i % GRADIENTS.length],
  }));

  if (isLoading && !categories.length) {
    return (
      <Box sx={{ py: 8, px: 3 }}>
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: COLORS.gray[50] }}>
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 8 } }}>
        <ScrollReveal>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography className="section-tag" sx={{ justifyContent: 'center', mb: 2 }}>
              Explore
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 300,
                fontSize: { xs: '2.2rem', md: '3.5rem' },
              }}
            >
              Shop by Category
            </Typography>
          </Box>
        </ScrollReveal>

        <Grid container spacing={2}>
          {/* Large featured category */}
          <Grid size={{ xs: 12, md: 6 }}>
            <ScrollReveal delay={0}>
              <CategoryCard category={categories[0]} height={{ xs: 300, md: 500 }} />
            </ScrollReveal>
          </Grid>

          {/* Right column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
              {categories.slice(1).map((cat, i) => (
                <Grid key={cat.slug} size={{ xs: 12, sm: 6 }}>
                  <ScrollReveal delay={0.1 * (i + 1)}>
                    <CategoryCard category={cat} height={{ xs: 180, md: 238 }} />
                  </ScrollReveal>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function CategoryCard({ category, height }: { category: DisplayCategory; height: any }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link href={`/category/${category.slug}`}>
      <Box
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          position: 'relative',
          height,
          background: category.color,
          overflow: 'hidden',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: 4,
        }}
      >
        {/* Animated background circle */}
        <motion.div
          animate={{
            scale: hovered ? 1.5 : 1,
            opacity: hovered ? 0.15 : 0.08,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '30%',
            right: '20%',
            width: '60%',
            paddingBottom: '60%',
            borderRadius: '50%',
            backgroundColor: category.accent,
          }}
        />

        {/* Geometric lines */}
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 60,
            height: 60,
            border: `1px solid ${COLORS.white}22`,
            borderRadius: '50%',
          }}
        />

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              fontWeight: 300,
              color: COLORS.white,
              letterSpacing: '0.02em',
              mb: 0.5,
            }}
          >
            {category.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: `${COLORS.white}77`,
              letterSpacing: '0.1em',
              mb: 2,
              display: 'block',
            }}
          >
            {category.description}
          </Typography>
          <motion.div
            animate={{ x: hovered ? 8 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography
              variant="caption"
              sx={{
                color: category.accent,
                letterSpacing: '0.12em',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              EXPLORE <ArrowForward sx={{ fontSize: 14 }} />
            </Typography>
          </motion.div>
        </Box>

        {/* Hover overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)`,
          }}
        />
      </Box>
    </Link>
  );
}
