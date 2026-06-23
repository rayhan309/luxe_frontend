'use client';

import React from 'react';
import { Box, Typography, Container, TextField, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { COLORS } from '@/lib/theme';

export default function Newsletter() {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        backgroundColor: COLORS.black,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gold line accents */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: `${COLORS.gold}33` }} />
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: `${COLORS.gold}33` }} />

      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `repeating-linear-gradient(
            45deg,
            ${COLORS.gold} 0px,
            ${COLORS.gold} 1px,
            transparent 1px,
            transparent 60px
          )`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="sm">
        <ScrollReveal>
          <Box sx={{ textAlign: 'center' }}>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ display: 'inline-block', marginBottom: 16 }}
            >
              <Typography sx={{ fontSize: '2.5rem' }}>✦</Typography>
            </motion.div>

            <Typography
              variant="overline"
              sx={{ color: COLORS.gold, letterSpacing: '0.2em', display: 'block', mb: 2 }}
            >
              The Inner Circle
            </Typography>

            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 300,
                color: COLORS.white,
                lineHeight: 1.2,
                mb: 2,
              }}
            >
              Be the First to Know
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: `${COLORS.white}66`, mb: 5, letterSpacing: '0.04em', lineHeight: 1.8 }}
            >
              Join our exclusive circle for early access to new arrivals,
              private sales, and curated style inspiration delivered to your inbox.
            </Typography>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Box
                  sx={{
                    border: `1px solid ${COLORS.gold}55`,
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: `${COLORS.gold}11`,
                  }}
                >
                  <Typography sx={{ color: COLORS.gold, letterSpacing: '0.1em', fontWeight: 500 }}>
                    ✓ Welcome to the Circle
                  </Typography>
                  <Typography variant="caption" sx={{ color: `${COLORS.white}55`, mt: 1, display: 'block' }}>
                    You'll hear from us soon with something special.
                  </Typography>
                </Box>
              </motion.div>
            ) : (
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', gap: 0, maxWidth: 440, mx: 'auto' }}
              >
                <TextField
                  fullWidth
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  size="medium"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      backgroundColor: `${COLORS.white}08`,
                      color: COLORS.white,
                      '& fieldset': { borderColor: `${COLORS.white}22` },
                      '&:hover fieldset': { borderColor: COLORS.gold },
                      '&.Mui-focused fieldset': { borderColor: COLORS.gold },
                    },
                    '& input::placeholder': { color: `${COLORS.white}44` },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    borderRadius: 0,
                    backgroundColor: COLORS.gold,
                    color: COLORS.white,
                    px: 4,
                    flexShrink: 0,
                    '&:hover': { backgroundColor: COLORS.goldDark },
                  }}
                >
                  <ArrowForward />
                </Button>
              </Box>
            )}

            <Typography variant="caption" sx={{ color: `${COLORS.white}33`, mt: 3, display: 'block' }}>
              No spam, ever. Unsubscribe at any time.
            </Typography>
          </Box>
        </ScrollReveal>
      </Container>
    </Box>
  );
}
