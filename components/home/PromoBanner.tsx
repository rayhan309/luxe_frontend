'use client';

import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowForward } from '@mui/icons-material';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { COLORS } from '@/lib/theme';

export default function PromoBanner() {
  return (
    <Box
      sx={{
        py: { xs: 0, md: 0 },
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Main Promo Banner */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${COLORS.black} 0%, #1A1025 50%, ${COLORS.black} 100%)`,
          py: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <Box
          component={motion.div}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          sx={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '50vw',
            height: '50vw',
            border: `1px solid ${COLORS.gold}15`,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <Box
          component={motion.div}
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          sx={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '40vw',
            height: '40vw',
            border: `1px solid ${COLORS.gold}20`,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="md">
          <ScrollReveal>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="overline"
                sx={{
                  color: COLORS.gold,
                  letterSpacing: '0.25em',
                  mb: 2,
                  display: 'block',
                }}
              >
                Limited Time Offer
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: { xs: '2.8rem', md: '5rem' },
                  fontWeight: 300,
                  color: COLORS.white,
                  lineHeight: 1.05,
                  mb: 2,
                  letterSpacing: '-0.02em',
                }}
              >
                Up to <span style={{ color: COLORS.gold }}>40% Off</span>
                <br />
                Selected Styles
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: `${COLORS.white}77`,
                  mb: 5,
                  letterSpacing: '0.04em',
                  maxWidth: 400,
                  mx: 'auto',
                }}
              >
                Use code{' '}
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    backgroundColor: `${COLORS.gold}22`,
                    border: `1px solid ${COLORS.gold}44`,
                    px: 1.5,
                    py: 0.25,
                    letterSpacing: '0.15em',
                    color: COLORS.gold,
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: '1.1rem',
                  }}
                >
                  WELCOME20
                </Box>{' '}
                at checkout
              </Typography>
              <Button
                component={Link}
                href="/products?sort=popular"
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{
                  backgroundColor: COLORS.gold,
                  color: COLORS.white,
                  px: 6,
                  py: 2,
                  fontSize: '0.8rem',
                  letterSpacing: '0.15em',
                  '&:hover': {
                    backgroundColor: COLORS.goldDark,
                    boxShadow: `0 8px 30px ${COLORS.gold}44`,
                  },
                }}
              >
                Shop the Sale
              </Button>
            </Box>
          </ScrollReveal>
        </Container>
      </Box>
    </Box>
  );
}
