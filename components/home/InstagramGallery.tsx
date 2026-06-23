'use client';

import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { COLORS } from '@/lib/theme';
import 'swiper/css';
import 'swiper/css/free-mode';

const GALLERY_ITEMS = [
  { id: 1, gradient: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)', label: 'Evening Edit' },
  { id: 2, gradient: 'linear-gradient(135deg, #0F2027 0%, #203A43 100%)', label: 'Tailoring' },
  { id: 3, gradient: 'linear-gradient(135deg, #1C1C1C 0%, #2D2D2D 100%)', label: 'Accessories' },
  { id: 4, gradient: 'linear-gradient(135deg, #1A0F1C 0%, #2D1B35 100%)', label: 'Resort' },
  { id: 5, gradient: 'linear-gradient(135deg, #0A0A0A 0%, #1A1025 100%)', label: 'Studio' },
  { id: 6, gradient: 'linear-gradient(135deg, #16213E 0%, #0F3460 100%)', label: 'Campaign' },
  { id: 7, gradient: 'linear-gradient(135deg, #2D2D2D 0%, #1A1A1A 100%)', label: 'Details' },
  { id: 8, gradient: 'linear-gradient(135deg, #1A1025 0%, #0A0A0A 100%)', label: 'Lifestyle' },
];

export default function InstagramGallery() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: COLORS.black, overflow: 'hidden' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 8 }, mb: 6 }}>
        <ScrollReveal>
          <Box sx={{ textAlign: 'center' }}>
            <Typography className="section-tag" sx={{ justifyContent: 'center', mb: 2, color: COLORS.gold }}>
              @LUXE
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 300,
                fontSize: { xs: '2rem', md: '3rem' },
                color: COLORS.white,
                letterSpacing: '0.04em',
              }}
            >
              The World of LUXE
            </Typography>
          </Box>
        </ScrollReveal>
      </Container>

      <Swiper
        modules={[Autoplay, FreeMode]}
        slidesPerView={2.2}
        spaceBetween={12}
        freeMode
        loop
        autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
        speed={8000}
        breakpoints={{
          640: { slidesPerView: 3.2, spaceBetween: 16 },
          960: { slidesPerView: 4.5, spaceBetween: 20 },
          1280: { slidesPerView: 5.5, spaceBetween: 24 },
        }}
        style={{ paddingLeft: 24, paddingRight: 24 }}
      >
        {[...GALLERY_ITEMS, ...GALLERY_ITEMS].map((item, i) => (
          <SwiperSlide key={`${item.id}-${i}`}>
            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.4 }}>
              <Box
                sx={{
                  aspectRatio: '1',
                  background: item.gradient,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    p: 2,
                  }}
                >
                  <Typography variant="caption" sx={{ color: COLORS.white, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    {item.label}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
