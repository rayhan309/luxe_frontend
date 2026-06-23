'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder, ShoppingBag } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { COLORS } from '@/lib/theme';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { cartAPI } from '@/lib/api/cart';
import { wishlistAPI } from '@/lib/api/wishlist';
import { resolveMediaUrl } from '@/lib/utils/media';
import { useSnackbar } from 'notistack';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [hovering, setHovering] = React.useState(false);
  const [adding, setAdding] = React.useState(false);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { setCart, openCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { enqueueSnackbar } = useSnackbar();
  const inWishlist = isInWishlist(product.id);

  const discountPercent = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      enqueueSnackbar('Please sign in to add to cart', { variant: 'info' });
      return;
    }
    setAdding(true);
    try {
      const { data } = await cartAPI.addItem({ product_id: product.id, quantity: 1 });
      setCart(data.data);
      openCart();
      enqueueSnackbar('Added to cart', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to add to cart', { variant: 'error' });
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      try {
        await wishlistAPI.toggle(product.id);
        toggleItem(product.id);
      } catch {
        enqueueSnackbar('Wishlist update failed', { variant: 'error' });
      }
    } else {
      toggleItem(product.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
    >
      <Link href={`/products/${product.slug}`} style={{ display: 'block' }}>
        <Box
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          sx={{ cursor: 'pointer' }}
        >
          {/* Image Container */}
          <Box
            sx={{
              position: 'relative',
              aspectRatio: '3/4',
              overflow: 'hidden',
              backgroundColor: COLORS.gray[50],
              mb: 2,
            }}
          >
            <Image
              src={resolveMediaUrl(product.thumbnail) || '/placeholder-product.svg'}
              alt={product.name}
              fill
              style={{
                objectFit: 'cover',
                transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hovering ? 'scale(1.06)' : 'scale(1)',
              }}
            />

            {/* Badges */}
            <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {product.is_new_arrival && (
                <Chip
                  label="NEW"
                  size="small"
                  sx={{
                    backgroundColor: COLORS.black,
                    color: COLORS.white,
                    fontSize: '0.6rem',
                    height: 20,
                    letterSpacing: '0.08em',
                    borderRadius: 0,
                  }}
                />
              )}
              {discountPercent > 0 && (
                <Chip
                  label={`-${discountPercent}%`}
                  size="small"
                  sx={{
                    backgroundColor: COLORS.gold,
                    color: COLORS.white,
                    fontSize: '0.6rem',
                    height: 20,
                    letterSpacing: '0.05em',
                    borderRadius: 0,
                  }}
                />
              )}
            </Box>

            {/* Wishlist */}
            <IconButton
              onClick={handleWishlist}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: `${COLORS.white}CC`,
                backdropFilter: 'blur(4px)',
                width: 34,
                height: 34,
                opacity: hovering ? 1 : 0,
                transform: hovering ? 'scale(1)' : 'scale(0.8)',
                transition: 'all 0.3s ease',
                '&:hover': { backgroundColor: COLORS.white },
              }}
            >
              {inWishlist ? (
                <Favorite sx={{ fontSize: 16, color: '#E57373' }} />
              ) : (
                <FavoriteBorder sx={{ fontSize: 16, color: COLORS.black }} />
              )}
            </IconButton>

            {/* Quick Add */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: COLORS.black,
                overflow: 'hidden',
                height: hovering ? 44 : 0,
                transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                cursor: 'pointer',
              }}
              onClick={handleAddToCart}
            >
              <ShoppingBag sx={{ fontSize: 16, color: COLORS.white }} />
              <Typography
                variant="caption"
                sx={{
                  color: COLORS.white,
                  letterSpacing: '0.12em',
                  fontWeight: 500,
                  opacity: hovering ? 1 : 0,
                  transition: 'opacity 0.3s ease 0.1s',
                }}
              >
                {adding ? 'ADDING...' : 'QUICK ADD'}
              </Typography>
            </Box>
          </Box>

          {/* Info */}
          <Box>
            {product.category && (
              <Typography variant="caption" sx={{ color: COLORS.muted, letterSpacing: '0.08em' }}>
                {product.category.name}
              </Typography>
            )}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                mt: 0.5,
                mb: 0.75,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                letterSpacing: '0.02em',
              }}
            >
              {product.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: COLORS.black }}
              >
                ${product.price.toFixed(2)}
              </Typography>
              {product.compare_price && product.compare_price > 0 ? (
                <Typography
                  variant="caption"
                  sx={{
                    color: COLORS.gray[400],
                    textDecoration: 'line-through',
                    letterSpacing: '0.02em',
                  }}
                >
                  ${product.compare_price.toFixed(2)}
                </Typography>
              ) : null}
            </Box>
            {/* Rating */}
            {product.average_rating > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: i < Math.round(product.average_rating) ? COLORS.gold : COLORS.gray[200],
                      borderRadius: '50%',
                    }}
                  />
                ))}
                <Typography variant="caption" sx={{ color: COLORS.muted, ml: 0.5 }}>
                  ({product.review_count})
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Link>
    </motion.div>
  );
}
