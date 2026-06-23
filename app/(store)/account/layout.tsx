'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Paper,
  Button,
} from '@mui/material';
import {
  Person,
  ShoppingBag,
  Favorite,
  LocationOn,
  VpnKey,
  Logout,
} from '@mui/icons-material';
import { useAuthStore } from '@/lib/store/authStore';
import { COLORS } from '@/lib/theme';
import ScrollReveal from '@/components/animations/ScrollReveal';

const MENU_ITEMS = [
  { label: 'Profile Settings', href: '/account', icon: Person },
  { label: 'My Orders', href: '/account/orders', icon: ShoppingBag },
  { label: 'My Wishlist', href: '/account/wishlist', icon: Favorite },
  { label: 'Addresses', href: '/account/addresses', icon: LocationOn },
  { label: 'Change Password', href: '/account/password', icon: VpnKey },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/login?redirect=/account');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  if (!isAuthenticated || !user) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" sx={{ letterSpacing: '0.05em', color: COLORS.muted }}>
          Redirecting to login...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 8 }, py: { xs: 6, md: 10 } }}>
      <ScrollReveal>
        <Box sx={{ mb: 6 }}>
          <Typography className="section-tag" sx={{ mb: 1 }}>My Account</Typography>
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 300,
            }}
          >
            Welcome, {user.first_name}
          </Typography>
        </Box>
      </ScrollReveal>

      <Grid container spacing={4}>
        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${COLORS.gray[100]}`,
              borderRadius: 0,
              overflow: 'hidden',
              backgroundColor: COLORS.white,
            }}
          >
            <Box sx={{ p: 3, backgroundColor: COLORS.gray[50] }}>
              <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: '0.02em' }}>
                {user.first_name} {user.last_name}
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.muted, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.email}
              </Typography>
            </Box>
            <Divider />
            <List disablePadding>
              {MENU_ITEMS.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <ListItem key={item.href} disablePadding>
                    <ListItemButton
                      component={Link}
                      href={item.href}
                      selected={active}
                      sx={{
                        py: 2,
                        px: 3,
                        '&.Mui-selected': {
                          backgroundColor: `${COLORS.gold}08`,
                          color: COLORS.gold,
                          '&:hover': { backgroundColor: `${COLORS.gold}12` },
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      <Icon sx={{ fontSize: 18, mr: 2, color: active ? COLORS.gold : COLORS.gray[400] }} />
                      <ListItemText
                        primary={item.label}
                        slotProps={{
                          primary: {
                            sx: {
                              fontSize: '0.85rem',
                              letterSpacing: '0.05em',
                              fontWeight: active ? 600 : 400,
                            },
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
              <Divider />
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    py: 2,
                    px: 3,
                    color: COLORS.error,
                    '&:hover': { backgroundColor: '#FFEBEE' },
                    transition: 'all 0.2s',
                  }}
                >
                  <Logout sx={{ fontSize: 18, mr: 2 }} />
                  <ListItemText
                    primary="Sign Out"
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: '0.85rem',
                          letterSpacing: '0.05em',
                          fontWeight: 500,
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Content */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Box
            sx={{
              minHeight: 400,
              backgroundColor: COLORS.white,
              border: `1px solid ${COLORS.gray[100]}`,
              p: { xs: 3, md: 5 },
            }}
          >
            {children}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
