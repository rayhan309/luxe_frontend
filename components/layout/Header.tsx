'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Box,
  Typography,
  InputBase,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
} from '@mui/material';
import {
  ShoppingBag,
  Search,
  Person,
  Favorite,
  Menu as MenuIcon,
  Close,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { COLORS } from '@/lib/theme';

const NAV_LINKS = [
  { label: 'New Arrivals', href: '/products?sort=newest' },
  { label: 'Women', href: '/category/women' },
  { label: 'Men', href: '/category/men' },
  { label: 'Accessories', href: '/category/accessories' },
  { label: 'Sale', href: '/products?sort=popular', accent: true },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, toggleCart } = useCartStore();
  const { isAuthenticated, isAdmin } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomepage = pathname === '/';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: scrolled ? 'rgba(250,250,250,0.95)' : 'rgba(250,250,250,0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${scrolled ? COLORS.gray[200] : 'transparent'}`,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          color: COLORS.black,
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            backgroundColor: COLORS.black,
            py: 0.75,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: COLORS.white, letterSpacing: '0.12em', fontSize: '0.7rem' }}
          >
            FREE SHIPPING ON ORDERS OVER $150 · USE CODE{' '}
            <span style={{ color: COLORS.gold }}>WELCOME20</span> FOR 20% OFF
          </Typography>
        </Box>

        <Toolbar
          sx={{
            justifyContent: 'space-between',
            px: { xs: 2, md: 6 },
            py: 1.5,
            minHeight: { xs: '60px', md: '70px' },
          }}
        >
          {/* Mobile Menu */}
          <IconButton
            sx={{ display: { xs: 'flex', md: 'none' }, color: COLORS.black }}
            onClick={() => setMobileOpen(true)}
            id="mobile-menu-button"
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop Nav Left */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, flex: 1 }}>
            {NAV_LINKS.slice(0, 3).map((link) => (
              <Link key={link.href} href={link.href}>
                <Typography
                  variant="caption"
                  sx={{
                    color: link.accent ? COLORS.gold : COLORS.black,
                    letterSpacing: '0.1em',
                    fontWeight: 500,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -2,
                      left: 0,
                      width: pathname?.includes(link.href) ? '100%' : '0%',
                      height: '1px',
                      backgroundColor: link.accent ? COLORS.gold : COLORS.black,
                      transition: 'width 0.3s ease',
                    },
                    '&:hover::after': {
                      width: '100%',
                    },
                  }}
                >
                  {link.label}
                </Typography>
              </Link>
            ))}
          </Box>

          {/* Logo */}
          <Link href="/" style={{ flex: '0 0 auto' }}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontWeight: 300,
                  fontSize: { xs: '1.6rem', md: '2rem' },
                  letterSpacing: '0.25em',
                  color: COLORS.black,
                  userSelect: 'none',
                }}
              >
                LUXE
              </Typography>
            </motion.div>
          </Link>

          {/* Desktop Nav Right + Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'flex-end' }}>
            {/* Right nav links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, mr: 2 }}>
              {NAV_LINKS.slice(3).map((link) => (
                <Link key={link.href} href={link.href}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: link.accent ? COLORS.gold : COLORS.black,
                      letterSpacing: '0.1em',
                      fontWeight: link.accent ? 600 : 500,
                    }}
                  >
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Box>

            {/* Search */}
            <IconButton
              onClick={() => setSearchOpen(!searchOpen)}
              sx={{ color: COLORS.black }}
              id="search-button"
            >
              <Search sx={{ fontSize: 20 }} />
            </IconButton>

            {/* Wishlist */}
            <Link href="/account/wishlist">
              <IconButton sx={{ color: COLORS.black }}>
                <Favorite sx={{ fontSize: 20 }} />
              </IconButton>
            </Link>

            {/* Account */}
            <Link href={isAuthenticated ? (isAdmin ? '/admin' : '/account') : '/login'}>
              <IconButton sx={{ color: COLORS.black }} id="account-button">
                <Person sx={{ fontSize: 20 }} />
              </IconButton>
            </Link>

            {/* Cart */}
            <IconButton
              onClick={toggleCart}
              sx={{ color: COLORS.black }}
              id="cart-button"
            >
              <Badge
                badgeContent={itemCount}
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: COLORS.gold,
                    color: COLORS.white,
                    fontSize: '0.65rem',
                    minWidth: '18px',
                    height: '18px',
                    borderRadius: '50%',
                  },
                }}
              >
                <ShoppingBag sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                  borderTop: `1px solid ${COLORS.gray[100]}`,
                  px: { xs: 2, md: 6 },
                  py: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  backgroundColor: COLORS.white,
                }}
              >
                <Search sx={{ color: COLORS.gray[500], fontSize: 20 }} />
                <InputBase
                  fullWidth
                  autoFocus
                  placeholder="Search for products, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    fontSize: '1rem',
                    fontFamily: '"Cormorant Garamond", serif',
                    letterSpacing: '0.05em',
                    '& input::placeholder': { color: COLORS.gray[400] },
                  }}
                />
                <IconButton onClick={() => setSearchOpen(false)} size="small">
                  <Close sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 300,
              backgroundColor: COLORS.white,
              borderRadius: 0,
            },
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '1.5rem',
              letterSpacing: '0.2em',
            }}
          >
            LUXE
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {NAV_LINKS.map((link) => (
            <ListItem
              key={link.href}
              component={Link}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              sx={{ py: 2 }}
            >
              <ListItemText
                primary={link.label}
                slotProps={{
                  primary: {
                    sx: {
                      letterSpacing: '0.1em',
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      color: link.accent ? COLORS.gold : COLORS.black,
                      fontWeight: 500,
                    },
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem
            component={Link}
            href={isAuthenticated ? '/account' : '/login'}
            onClick={() => setMobileOpen(false)}
            sx={{ py: 1.5 }}
          >
            <Person sx={{ mr: 2, fontSize: 18 }} />
            <ListItemText
              primary={isAuthenticated ? 'My Account' : 'Sign In'}
              slotProps={{
                primary: {
                  sx: { fontSize: '0.85rem', letterSpacing: '0.05em' },
                },
              }}
            />
          </ListItem>
          <ListItem
            component={Link}
            href="/account/wishlist"
            onClick={() => setMobileOpen(false)}
            sx={{ py: 1.5 }}
          >
            <Favorite sx={{ mr: 2, fontSize: 18 }} />
            <ListItemText
              primary="Wishlist"
              slotProps={{
                primary: {
                  sx: { fontSize: '0.85rem', letterSpacing: '0.05em' },
                },
              }}
            />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
