'use client';

import React from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import {
  Instagram,
  Twitter,
  Facebook,
  Pinterest,
  YouTube,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { COLORS } from '@/lib/theme';

const footerLinks = {
  shop: [
    { label: 'New Arrivals', href: '/products?sort=newest' },
    { label: 'Women', href: '/category/women' },
    { label: 'Men', href: '/category/men' },
    { label: 'Accessories', href: '/category/accessories' },
    { label: 'Sale', href: '/products?sort=popular' },
  ],
  help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'Contact Us', href: '/contact' },
  ],
  company: [
    { label: 'About LUXE', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

const socials = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Pinterest, href: '#', label: 'Pinterest' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: YouTube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
    // TODO: connect to newsletter API
  };

  return (
    <Box
      component="footer"
      sx={{ backgroundColor: COLORS.black, color: COLORS.white, pt: { xs: 8, md: 12 } }}
    >
      {/* Newsletter Strip */}
      <Box
        sx={{
          borderTop: `1px solid ${COLORS.gray[800]}`,
          borderBottom: `1px solid ${COLORS.gray[800]}`,
          py: 6,
          mb: 8,
          background: `linear-gradient(135deg, ${COLORS.gray[900]} 0%, ${COLORS.black} 100%)`,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="overline"
              sx={{ color: COLORS.gold, letterSpacing: '0.2em', mb: 1, display: 'block' }}
            >
              Join The Circle
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                fontWeight: 300,
                letterSpacing: '-0.01em',
                mb: 1,
              }}
            >
              Get Exclusive Access
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: COLORS.gray[400], mb: 4, letterSpacing: '0.04em' }}
            >
              Subscribe for early access to new collections, private sales & styling tips.
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubscribe}
              sx={{ display: 'flex', gap: 0, maxWidth: 480, mx: 'auto' }}
            >
              <TextField
                fullWidth
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    backgroundColor: COLORS.gray[900],
                    color: COLORS.white,
                    '& fieldset': { borderColor: COLORS.gray[700] },
                    '&:hover fieldset': { borderColor: COLORS.gold },
                    '&.Mui-focused fieldset': { borderColor: COLORS.gold },
                  },
                  '& input::placeholder': { color: COLORS.gray[500] },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: 0,
                  backgroundColor: COLORS.gold,
                  color: COLORS.white,
                  px: 3,
                  py: 1,
                  '&:hover': { backgroundColor: COLORS.goldDark },
                  minWidth: 'auto',
                  flexShrink: 0,
                }}
              >
                <ArrowForward sx={{ fontSize: 18 }} />
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Links */}
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 8 } }}>
        <Grid container spacing={6} sx={{ mb: 8 }}>
          {/* Brand Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '2.5rem',
                fontWeight: 300,
                letterSpacing: '0.3em',
                mb: 2,
              }}
            >
              LUXE
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: COLORS.gray[400], lineHeight: 1.8, mb: 4, maxWidth: 280 }}
            >
              Curating extraordinary fashion and lifestyle products for the discerning individual.
            </Typography>
            <Stack direction="row" spacing={1}>
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.1, color: COLORS.gold }}
                  style={{ color: COLORS.gray[500], display: 'flex' }}
                >
                  <Icon sx={{ fontSize: 18 }} />
                </motion.a>
              ))}
            </Stack>
          </Grid>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <Grid key={title} size={{ xs: 6, md: 2 }}>
              <Typography
                variant="overline"
                sx={{ color: COLORS.gold, letterSpacing: '0.15em', mb: 3, display: 'block' }}
              >
                {title.toUpperCase()}
              </Typography>
              <Stack spacing={2}>
                {links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: COLORS.gray[400],
                        letterSpacing: '0.04em',
                        transition: 'color 0.2s ease',
                        '&:hover': { color: COLORS.white },
                      }}
                    >
                      {link.label}
                    </Typography>
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: COLORS.gray[800], mb: 4 }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'center' },
            pb: 4,
            gap: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: COLORS.gray[600], letterSpacing: '0.08em' }}
          >
            © {new Date().getFullYear()} LUXE. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Terms', 'Privacy', 'Cookies'].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`}>
                <Typography
                  variant="caption"
                  sx={{
                    color: COLORS.gray[600],
                    letterSpacing: '0.08em',
                    '&:hover': { color: COLORS.gold },
                    transition: 'color 0.2s',
                  }}
                >
                  {item}
                </Typography>
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
