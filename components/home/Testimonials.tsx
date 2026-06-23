'use client';

import React from 'react';
import { Box, Typography, Container, Avatar, Rating } from '@mui/material';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { COLORS } from '@/lib/theme';

const testimonials = [
  {
    id: 1,
    name: 'Sophia Laurent',
    title: 'Fashion Editor',
    avatar: 'SL',
    rating: 5,
    text: 'LUXE has completely transformed my wardrobe. The quality is unmatched — every piece feels like it was made exclusively for me. The attention to detail is extraordinary.',
    location: 'Paris, France',
  },
  {
    id: 2,
    name: 'Marcus Chen',
    title: 'Creative Director',
    avatar: 'MC',
    rating: 5,
    text: 'I\'ve shopped luxury brands all over the world, and LUXE stands apart. The curation is impeccable, delivery is flawless, and the packaging alone is an experience.',
    location: 'New York, USA',
  },
  {
    id: 3,
    name: 'Isabella Rossi',
    title: 'Interior Designer',
    avatar: 'IR',
    rating: 5,
    text: 'Every order from LUXE is a moment of pure joy. The pieces photograph beautifully and the materials age gracefully. This is luxury done right.',
    location: 'Milan, Italy',
  },
];

export default function Testimonials() {
  return (
    <Box
      sx={{
        py: { xs: 10, md: 16 },
        backgroundColor: COLORS.gray[50],
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background accent */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
        }}
      />

      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 8 } }}>
        <ScrollReveal>
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography className="section-tag" sx={{ justifyContent: 'center', mb: 2 }}>
              Client Stories
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: { xs: '2.2rem', md: '3.5rem' },
                fontWeight: 300,
              }}
            >
              What Our Clients Say
            </Typography>
          </Box>
        </ScrollReveal>

        {/* Large centered quote */}
        <ScrollReveal delay={0.1}>
          <Box
            sx={{
              textAlign: 'center',
              mb: 10,
              px: { xs: 0, md: 8 },
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: { xs: '1.4rem', md: '2.2rem' },
                fontWeight: 300,
                fontStyle: 'italic',
                color: COLORS.gray[600],
                lineHeight: 1.6,
                mb: 3,
                '&::before': { content: '"\u201C"', color: COLORS.gold, mr: 1 },
                '&::after': { content: '"\u201D"', color: COLORS.gold, ml: 1 },
              }}
            >
              {testimonials[0].text}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Box sx={{ width: 40, height: 1, backgroundColor: COLORS.gold }} />
              <Typography
                variant="caption"
                sx={{ letterSpacing: '0.15em', color: COLORS.black, fontWeight: 500 }}
              >
                {testimonials[0].name} · {testimonials[0].title}
              </Typography>
              <Box sx={{ width: 40, height: 1, backgroundColor: COLORS.gold }} />
            </Box>
          </Box>
        </ScrollReveal>

        {/* All testimonials */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
          }}
        >
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.15}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                <Box
                  sx={{
                    p: 4,
                    backgroundColor: COLORS.white,
                    border: `1px solid ${COLORS.gray[100]}`,
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Gold accent top line */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 40,
                      height: 2,
                      backgroundColor: COLORS.gold,
                    }}
                  />

                  <Rating
                    value={t.rating}
                    readOnly
                    size="small"
                    sx={{
                      mb: 2,
                      '& .MuiRating-iconFilled': { color: COLORS.gold },
                      '& .MuiRating-iconEmpty': { color: COLORS.gray[200] },
                    }}
                  />

                  <Typography
                    sx={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: '1.05rem',
                      fontStyle: 'italic',
                      color: COLORS.gray[600],
                      lineHeight: 1.7,
                      mb: 3,
                      flex: 1,
                    }}
                  >
                    "{t.text}"
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        backgroundColor: COLORS.black,
                        color: COLORS.gold,
                        width: 44,
                        height: 44,
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {t.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: '0.03em' }}>
                        {t.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: COLORS.muted }}>
                        {t.title} · {t.location}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </ScrollReveal>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
