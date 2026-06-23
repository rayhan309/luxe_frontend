'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Stack,
} from '@mui/material';
import { Close, Add, Remove, Delete, DeleteOutlined, ShoppingBag } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store/cartStore';
import { cartAPI } from '@/lib/api/cart';
import { useAuthStore } from '@/lib/store/authStore';
import { COLORS } from '@/lib/theme';
import { useSnackbar } from 'notistack';

export default function CartDrawer() {
  const { cart, isOpen, closeCart, subtotal, setCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleQuantityChange = async (itemId: string, newQty: number) => {
    if (!isAuthenticated) return;
    setLoading(itemId);
    try {
      const { data } = await cartAPI.updateItem(itemId, newQty);
      setCart(data.data);
    } catch {
      enqueueSnackbar('Failed to update cart', { variant: 'error' });
    } finally {
      setLoading(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    if (!isAuthenticated) return;
    setLoading(itemId);
    try {
      const { data } = await cartAPI.removeItem(itemId);
      setCart(data.data);
      enqueueSnackbar('Item removed', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to remove item', { variant: 'error' });
    } finally {
      setLoading(null);
    }
  };

  const shippingThreshold = 150;
  const remaining = shippingThreshold - subtotal;
  const shippingProgress = Math.min((subtotal / shippingThreshold) * 100, 100);

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={closeCart}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100vw', sm: 420 },
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 0,
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3,
          borderBottom: `1px solid ${COLORS.gray[100]}`,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '1.4rem',
              letterSpacing: '0.08em',
            }}
          >
            Your Cart
          </Typography>
          <Typography variant="caption" sx={{ color: COLORS.muted }}>
            {cart?.items?.length || 0} items
          </Typography>
        </Box>
        <IconButton onClick={closeCart} size="small">
          <Close />
        </IconButton>
      </Box>

      {/* Free Shipping Progress */}
      <Box sx={{ px: 3, py: 1.5, backgroundColor: COLORS.gray[50] }}>
        {remaining > 0 ? (
          <Typography variant="caption" sx={{ color: COLORS.muted }}>
            Add <strong style={{ color: COLORS.black }}>${remaining.toFixed(2)}</strong> more for free shipping
          </Typography>
        ) : (
          <Typography variant="caption" sx={{ color: COLORS.success }}>
            🎉 You qualify for free shipping!
          </Typography>
        )}
        <Box
          sx={{
            mt: 1,
            height: 2,
            backgroundColor: COLORS.gray[200],
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <motion.div
            animate={{ width: `${shippingProgress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              height: '100%',
              backgroundColor: COLORS.gold,
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          />
        </Box>
      </Box>

      {/* Items */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
        {!cart?.items?.length ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 2,
              py: 8,
            }}
          >
            <ShoppingBag sx={{ fontSize: 48, color: COLORS.gray[300] }} />
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '1.3rem',
                color: COLORS.muted,
              }}
            >
              Your cart is empty
            </Typography>
            <Button
              variant="outlined"
              onClick={closeCart}
              component={Link}
              href="/products"
              sx={{ mt: 1, borderColor: COLORS.black, color: COLORS.black }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <Stack spacing={3}>
            <AnimatePresence>
              {cart.items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Image */}
                    <Box
                      sx={{
                        width: 90,
                        height: 110,
                        flexShrink: 0,
                        position: 'relative',
                        backgroundColor: COLORS.gray[50],
                        overflow: 'hidden',
                      }}
                    >
                      <Image
                        src={item.image || '/placeholder-product.svg'}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>

                    {/* Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          mb: 0.5,
                        }}
                      >
                        {item.name}
                      </Typography>
                      {item.attributes && Object.entries(item.attributes).map(([k, v]) => (
                        <Typography key={k} variant="caption" sx={{ color: COLORS.muted, display: 'block' }}>
                          {k}: {v}
                        </Typography>
                      ))}
                      <Typography
                        variant="body2"
                        sx={{ color: COLORS.gold, fontWeight: 500, mt: 1 }}
                      >
                        ${item.price.toFixed(2)}
                      </Typography>

                      {/* Qty & Remove */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            border: `1px solid ${COLORS.gray[200]}`,
                          }}
                        >
                          <IconButton
                            size="small"
                            sx={{ borderRadius: 0, p: 0.5 }}
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || loading === item.id}
                          >
                            <Remove sx={{ fontSize: 14 }} />
                          </IconButton>
                          <Typography
                            sx={{
                              px: 2,
                              fontSize: '0.85rem',
                              fontWeight: 500,
                              minWidth: 32,
                              textAlign: 'center',
                            }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            sx={{ borderRadius: 0, p: 0.5 }}
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={loading === item.id}
                          >
                            <Add sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => handleRemove(item.id)}
                          disabled={loading === item.id}
                          sx={{ color: COLORS.gray[400], '&:hover': { color: COLORS.error } }}
                        >
                          <DeleteOutlined sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                  <Divider sx={{ mt: 2 }} />
                </motion.div>
              ))}
            </AnimatePresence>
          </Stack>
        )}
      </Box>

      {/* Footer */}
      {(cart?.items?.length ?? 0) > 0 && (
        <Box
          sx={{
            p: 3,
            borderTop: `1px solid ${COLORS.gray[100]}`,
            backgroundColor: COLORS.white,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: COLORS.muted }}>Subtotal</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              ${subtotal.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="body2" sx={{ color: COLORS.muted }}>Shipping</Typography>
            <Typography variant="body2" sx={{ color: remaining <= 0 ? COLORS.success : COLORS.muted }}>
              {remaining <= 0 ? 'FREE' : 'Calculated at checkout'}
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            component={Link}
            href="/checkout"
            onClick={closeCart}
            sx={{
              backgroundColor: COLORS.black,
              color: COLORS.white,
              py: 2,
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              '&:hover': { backgroundColor: COLORS.gray[800] },
            }}
          >
            Proceed to Checkout
          </Button>
          <Button
            fullWidth
            variant="text"
            component={Link}
            href="/cart"
            onClick={closeCart}
            sx={{ mt: 1, color: COLORS.muted, fontSize: '0.75rem' }}
          >
            View Full Cart
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
