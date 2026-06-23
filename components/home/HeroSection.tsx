'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowForward } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { bannersAPI } from '@/lib/api/banners';
import { resolveMediaUrl } from '@/lib/utils/media';
import { COLORS } from '@/lib/theme';

const fallbackSlide = {
  tag: 'Curated Collection',
  title: 'Define\nYour World',
  subtitle: 'Curated luxury pieces for the modern sophisticate',
  cta: 'Explore Collection',
  href: '/products',
  accent: 'Timeless Elegance',
  bgGradient: `linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 60%, #16213E 100%)`,
  image: '',
};

export default function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const { data } = useQuery({
    queryKey: ['hero-banners'],
    queryFn: () => bannersAPI.list('hero'),
    staleTime: 5 * 60 * 1000,
  });

  const banner = data?.data?.data?.[0];
  const slide = banner ? {
    tag: banner.subtitle || 'New Collection',
    title: banner.title,
    subtitle: banner.subtitle || '',
    cta: banner.button_text || 'Shop Now',
    href: banner.link || '/products',
    accent: 'Timeless Elegance',
    bgGradient: fallbackSlide.bgGradient,
    image: banner.image,
  } : fallbackSlide;

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '95vh', md: '100vh' },
        minHeight: { xs: 600, md: 800 },
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: slide.bgGradient,
          }}
        />
        {/* Gold geometric accent */}
        <Box
          sx={{
            position: 'absolute',
            right: { xs: '-20%', md: '5%' },
            top: '10%',
            width: { xs: '70vw', md: '42vw' },
            height: { xs: '70vw', md: '42vw' },
            maxWidth: 700,
            maxHeight: 700,
            border: `1px solid ${COLORS.gold}22`,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: { xs: '-10%', md: '10%' },
            top: '15%',
            width: { xs: '55vw', md: '35vw' },
            height: { xs: '55vw', md: '35vw' },
            maxWidth: 580,
            maxHeight: 580,
            border: `1px solid ${COLORS.gold}44`,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        {/* Hero visual */}
        {slide.image ? (
          <Box
            component={motion.div}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            sx={{
              position: 'absolute',
              right: { xs: '5%', md: '12%' },
              top: '50%',
              transform: 'translateY(-50%)',
              width: { xs: 200, md: 380 },
              height: { xs: 260, md: 500 },
              overflow: 'hidden',
              border: `1px solid ${COLORS.gold}33`,
            }}
          >
            <Image src={resolveMediaUrl(slide.image)} alt={slide.title} fill style={{ objectFit: 'cover' }} priority />
          </Box>
        ) : (
        <Box
          component={motion.div}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          sx={{
            position: 'absolute',
            right: { xs: '5%', md: '12%' },
            top: '50%',
            transform: 'translateY(-50%)',
            width: { xs: 200, md: 380 },
            height: { xs: 260, md: 500 },
            background: `radial-gradient(ellipse at center, ${COLORS.gold}22 0%, transparent 70%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Ornamental fashion icon */}
          <Box
            sx={{
              width: { xs: 160, md: 300 },
              height: { xs: 200, md: 380 },
              background: `linear-gradient(145deg, ${COLORS.gray[800]} 0%, ${COLORS.gray[900]} 100%)`,
              border: `1px solid ${COLORS.gold}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(135deg, ${COLORS.gold}11 0%, transparent 50%, ${COLORS.gold}08 100%)`,
              }}
            />
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: { xs: '3rem', md: '5rem' },
                color: `${COLORS.gold}66`,
                fontWeight: 300,
                letterSpacing: '0.1em',
              }}
            >
              L
            </Typography>
          </Box>
        </Box>
        )}
      </motion.div>

      {/* Noise overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 w-full">
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 8 } }}>
          <Box sx={{ maxWidth: { xs: '100%', md: '55%' } }}>
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: COLORS.gold,
                  letterSpacing: '0.2em',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  '&::before': {
                    content: '""',
                    display: 'inline-block',
                    width: 40,
                    height: 1,
                    backgroundColor: COLORS.gold,
                  },
                }}
              >
                {slide.tag}
              </Typography>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Typography
                component="h1"
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontWeight: 300,
                  fontSize: { xs: '3.5rem', sm: '5rem', md: '7rem', lg: '8rem' },
                  lineHeight: 0.95,
                  letterSpacing: '-0.03em',
                  color: COLORS.white,
                  mb: 3,
                  whiteSpace: 'pre-line',
                }}
              >
                {slide.title}
              </Typography>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <Typography
                sx={{
                  color: `${COLORS.white}99`,
                  fontSize: { xs: '1rem', md: '1.15rem' },
                  letterSpacing: '0.04em',
                  mb: 5,
                  maxWidth: 440,
                  lineHeight: 1.7,
                }}
              >
                {slide.subtitle}
              </Typography>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  href={slide.href}
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{
                    backgroundColor: COLORS.gold,
                    color: COLORS.white,
                    px: 5,
                    py: 2,
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: COLORS.goldDark,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 30px ${COLORS.gold}44`,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {slide.cta}
                </Button>
                <Button
                  component={Link}
                  href="/about"
                  variant="outlined"
                  sx={{
                    borderColor: `${COLORS.white}44`,
                    color: COLORS.white,
                    px: 4,
                    py: 2,
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    '&:hover': {
                      borderColor: COLORS.white,
                      backgroundColor: `${COLORS.white}11`,
                    },
                  }}
                >
                  Our Story
                </Button>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </motion.div>

      {/* Bottom text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: `${COLORS.white}55`, letterSpacing: '0.15em' }}>
            SCROLL TO DISCOVER
          </Typography>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Box
              sx={{
                width: 1,
                height: 40,
                backgroundColor: `${COLORS.gold}55`,
                mx: 'auto',
              }}
            />
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  );
}
