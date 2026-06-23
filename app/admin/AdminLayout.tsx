'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Dashboard,
  Inventory2,
  Category,
  ShoppingCart,
  People,
  LocalOffer,
  Image as ImageIcon,
  StarRate,
  Menu as MenuIcon,
  Logout,
  Store,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { COLORS } from '@/lib/theme';
import AdminGuard from '@/components/admin/AdminGuard';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: Dashboard, href: '/admin' },
  { label: 'Products', icon: Inventory2, href: '/admin/products' },
  { label: 'Categories', icon: Category, href: '/admin/categories' },
  { label: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
  { label: 'Customers', icon: People, href: '/admin/customers' },
  { label: 'Coupons', icon: LocalOffer, href: '/admin/coupons' },
  { label: 'Banners', icon: ImageIcon, href: '/admin/banners' },
  { label: 'Reviews', icon: StarRate, href: '/admin/reviews' },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLORS.black,
        color: COLORS.white,
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '1.6rem',
            letterSpacing: '0.3em',
            color: COLORS.white,
          }}
        >
          LUXE
        </Typography>
        <Typography variant="caption" sx={{ color: COLORS.gold, letterSpacing: '0.15em' }}>
          ADMIN PANEL
        </Typography>
      </Box>

      <Divider sx={{ borderColor: COLORS.gray[800], mb: 1 }} />

      {/* Nav */}
      <List sx={{ flex: 1, px: 1 }}>
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const active = pathname === href || (href !== '/admin' && pathname?.startsWith(href));
          return (
            <ListItem
              key={href}
              component={Link}
              href={href}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 0,
                mb: 0.5,
                px: 2,
                py: 1.5,
                position: 'relative',
                backgroundColor: active ? `${COLORS.gold}18` : 'transparent',
                '&:hover': { backgroundColor: `${COLORS.white}08` },
                transition: 'background-color 0.2s',
              }}
            >
              {active && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    backgroundColor: COLORS.gold,
                  }}
                />
              )}
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Icon sx={{ fontSize: 18, color: active ? COLORS.gold : COLORS.gray[500] }} />
              </ListItemIcon>
              <ListItemText
                primary={label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: '0.82rem',
                      letterSpacing: '0.06em',
                      color: active ? COLORS.white : COLORS.gray[400],
                      fontWeight: active ? 500 : 400,
                    },
                  },
                }}
              />
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: COLORS.gray[800] }} />

      {/* User */}
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Avatar sx={{ width: 36, height: 36, backgroundColor: COLORS.gold, fontSize: '0.85rem' }}>
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ color: COLORS.white, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography variant="caption" sx={{ color: COLORS.gray[500] }}>Administrator</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View Store">
            <IconButton component={Link} href="/" size="small" sx={{ color: COLORS.gray[500], '&:hover': { color: COLORS.white } }}>
              <Store sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout} size="small" sx={{ color: COLORS.gray[500], '&:hover': { color: COLORS.error } }}>
              <Logout sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.gray[50] }}>
      {/* Desktop Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, borderRadius: 0 } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, borderRadius: 0, border: 'none' } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile AppBar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            display: { xs: 'flex', md: 'none' },
            backgroundColor: COLORS.black,
          }}
        >
          <Toolbar>
            <IconButton color="inherit" onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', letterSpacing: '0.2em', ml: 2 }}>
              LUXE Admin
            </Typography>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminGuard>{children}</AdminGuard>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
