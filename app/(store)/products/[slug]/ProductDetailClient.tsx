'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Box,
  Typography,
  Button,
  Chip,
  Rating,
  Tabs,
  Tab,
  Divider,
  Skeleton,
  Grid,
  IconButton,
  TextField,
  Container,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ShoppingBag,
  LocalShipping,
  Security,
  Replay,
  ZoomIn,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { productsAPI } from '@/lib/api/products';
import { cartAPI } from '@/lib/api/cart';
import { reviewsAPI } from '@/lib/api/reviews';
import { wishlistAPI } from '@/lib/api/wishlist';
import ProductCard from '@/components/product/ProductCard';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { resolveMediaUrl } from '@/lib/utils/media';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useAuthStore } from '@/lib/store/authStore';
import { COLORS } from '@/lib/theme';
import type { ProductVariant } from '@/types';

interface ProductDetailClientProps {
  slug: string;
}

const PROMISES = [
  { icon: LocalShipping, text: 'Free shipping on orders over $150' },
  { icon: Security, text: 'Secure payment & data protection' },
  { icon: Replay, text: 'Free 30-day returns' },
];

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const { setCart, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', title: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsAPI.getBySlug(slug),
  });

  const product = data?.data?.data;
  const inWishlist = product ? isInWishlist(product.id) : false;

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', product?.id],
    queryFn: () => reviewsAPI.getByProduct(product!.id, { limit: 10 }),
    enabled: !!product?.id,
  });
  const reviews = reviewsData?.data?.data || [];

  const { data: relatedData } = useQuery({
    queryKey: ['related', slug, product?.category_id],
    queryFn: () => productsAPI.getRelated(slug, product!.category_id),
    enabled: !!product?.category_id,
  });
  const relatedProducts = relatedData?.data?.data || [];

  const reviewMutation = useMutation({
    mutationFn: () => reviewsAPI.create({
      product_id: product!.id,
      rating: reviewForm.rating,
      title: reviewForm.title || undefined,
      comment: reviewForm.comment,
    }),
    onSuccess: () => {
      enqueueSnackbar('Review submitted for approval', { variant: 'success' });
      setReviewForm({ rating: 5, comment: '', title: '' });
      queryClient.invalidateQueries({ queryKey: ['reviews', product?.id] });
    },
    onError: () => enqueueSnackbar('Failed to submit review', { variant: 'error' }),
  });

  const addToCart = async (redirectToCheckout = false) => {
    if (!isAuthenticated) {
      enqueueSnackbar('Please sign in to continue', { variant: 'info' });
      router.push('/login');
      return;
    }
    if (!product) return;
    setAdding(true);
    try {
      const { data: cartData } = await cartAPI.addItem({
        product_id: product.id,
        variant_id: selectedVariant?.id,
        quantity,
        attributes: selectedAttrs,
      });
      setCart(cartData.data);
      if (redirectToCheckout) {
        router.push('/checkout');
      } else {
        openCart();
        enqueueSnackbar('Added to cart', { variant: 'success' });
      }
    } catch {
      enqueueSnackbar('Failed to add to cart', { variant: 'error' });
    } finally {
      setAdding(false);
    }
  };

  const handleAddToCart = () => addToCart(false);
  const handleBuyNow = () => addToCart(true);

  const handleWishlist = async () => {
    if (!product) return;
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

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 8 }, py: 6 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Skeleton variant="rectangular" sx={{ aspectRatio: '3/4' }} />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} variant="text" width={i % 2 === 0 ? '60%' : '80%'} sx={{ mb: 1 }} />
            ))}
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!product) return null;

  const images = product.images?.length ? product.images : [product.thumbnail || ''];
  const discountPercent = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 8 }, py: { xs: 4, md: 8 } }}>
        <Grid container spacing={{ xs: 4, md: 8 }}>
          {/* Gallery */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Thumbnails */}
              {images.length > 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: 72 }}>
                  {images.map((img, i) => (
                    <Box
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      sx={{
                        width: 72,
                        height: 90,
                        position: 'relative',
                        cursor: 'pointer',
                        border: `1px solid ${i === selectedImage ? COLORS.black : COLORS.gray[200]}`,
                        overflow: 'hidden',
                        transition: 'border-color 0.2s',
                        flexShrink: 0,
                      }}
                    >
                      <Image src={resolveMediaUrl(img) || '/placeholder-product.svg'} alt={`${product.name} ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                    </Box>
                  ))}
                </Box>
              )}

              {/* Main image */}
              <Box
                sx={{
                  flex: 1,
                  position: 'relative',
                  aspectRatio: '3/4',
                  overflow: 'hidden',
                  backgroundColor: COLORS.gray[50],
                  cursor: 'zoom-in',
                }}
                onClick={() => setZoomed(!zoomed)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, scale: zoomed ? 1.5 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ position: 'absolute', inset: 0 }}
                  >
                    <Image
                      src={resolveMediaUrl(images[selectedImage]) || '/placeholder-product.svg'}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Badges */}
                <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {product.is_new_arrival && (
                    <Chip label="NEW" size="small" sx={{ borderRadius: 0, backgroundColor: COLORS.black, color: COLORS.white, fontSize: '0.6rem' }} />
                  )}
                  {discountPercent > 0 && (
                    <Chip label={`-${discountPercent}%`} size="small" sx={{ borderRadius: 0, backgroundColor: COLORS.gold, color: COLORS.white, fontSize: '0.6rem' }} />
                  )}
                </Box>

                <IconButton
                  sx={{ position: 'absolute', bottom: 12, right: 12, backgroundColor: `${COLORS.white}BB` }}
                  size="small"
                >
                  <ZoomIn sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Info */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 100 } }}>
              {product.category && (
                <Typography variant="overline" sx={{ color: COLORS.gold, letterSpacing: '0.15em', mb: 1, display: 'block' }}>
                  {product.category.name}
                </Typography>
              )}

              <Typography
                component="h1"
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: { xs: '2rem', md: '2.8rem' },
                  fontWeight: 300,
                  letterSpacing: '-0.01em',
                  mb: 2,
                  lineHeight: 1.15,
                }}
              >
                {product.name}
              </Typography>

              {/* Rating */}
              {product.average_rating > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Rating
                    value={product.average_rating}
                    precision={0.5}
                    readOnly
                    size="small"
                    sx={{ '& .MuiRating-iconFilled': { color: COLORS.gold }, '& .MuiRating-iconEmpty': { color: COLORS.gray[200] } }}
                  />
                  <Typography variant="caption" sx={{ color: COLORS.muted }}>
                    ({product.review_count} reviews)
                  </Typography>
                </Box>
              )}

              {/* Price */}
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 3 }}>
                <Typography
                  sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: '2rem',
                    fontWeight: 400,
                    color: COLORS.black,
                  }}
                >
                  ${(selectedVariant?.price || product.price).toFixed(2)}
                </Typography>
                {product.compare_price && product.compare_price > 0 ? (
                  <Typography sx={{ color: COLORS.gray[400], textDecoration: 'line-through', fontSize: '1.1rem' }}>
                    ${product.compare_price.toFixed(2)}
                  </Typography>
                ) : null}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Attributes / Variants */}
              {product.attributes &&
                Object.entries(product.attributes).map(([attrName, options]) => (
                  <Box key={attrName} sx={{ mb: 3 }}>
                    <Typography variant="caption" sx={{ letterSpacing: '0.12em', textTransform: 'uppercase', mb: 1.5, display: 'block', fontWeight: 500 }}>
                      {attrName}: <span style={{ color: COLORS.muted, fontWeight: 400 }}>{selectedAttrs[attrName] || 'Select'}</span>
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {(options as string[]).map((opt) => (
                        <Box
                          key={opt}
                          onClick={() => setSelectedAttrs((prev) => ({ ...prev, [attrName]: opt }))}
                          sx={{
                            px: 2,
                            py: 1,
                            border: `1px solid ${selectedAttrs[attrName] === opt ? COLORS.black : COLORS.gray[200]}`,
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            letterSpacing: '0.05em',
                            transition: 'all 0.2s',
                            backgroundColor: selectedAttrs[attrName] === opt ? COLORS.black : 'transparent',
                            color: selectedAttrs[attrName] === opt ? COLORS.white : COLORS.black,
                            '&:hover': {
                              borderColor: COLORS.black,
                            },
                          }}
                        >
                          {opt}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}

              {/* Quantity */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="caption" sx={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>
                  Quantity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${COLORS.gray[200]}` }}>
                  <IconButton size="small" sx={{ borderRadius: 0 }} onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                    —
                  </IconButton>
                  <Typography sx={{ px: 3, minWidth: 40, textAlign: 'center', fontWeight: 500 }}>{quantity}</Typography>
                  <IconButton size="small" sx={{ borderRadius: 0 }} onClick={() => setQuantity((q) => q + 1)}>
                    +
                  </IconButton>
                </Box>
                <Typography variant="caption" sx={{ color: product.stock > 0 ? COLORS.success : COLORS.error }}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </Typography>
              </Box>

              {/* CTAs */}
              <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShoppingBag />}
                  onClick={handleAddToCart}
                  disabled={adding || product.stock === 0}
                  sx={{
                    backgroundColor: COLORS.black,
                    color: COLORS.white,
                    py: 2,
                    fontSize: '0.8rem',
                    letterSpacing: '0.12em',
                    flex: 2,
                    '&:hover': { backgroundColor: COLORS.gray[800] },
                  }}
                >
                  {adding ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleBuyNow}
                  disabled={adding || product.stock === 0}
                  sx={{
                    borderColor: COLORS.black,
                    color: COLORS.black,
                    py: 2,
                    fontSize: '0.8rem',
                    letterSpacing: '0.12em',
                    borderRadius: 0,
                    flex: 1,
                  }}
                >
                  Buy Now
                </Button>
                <IconButton
                  onClick={handleWishlist}
                  sx={{
                    border: `1px solid ${COLORS.gray[200]}`,
                    borderRadius: 0,
                    p: 2,
                    width: 56,
                    height: 56,
                    '&:hover': { borderColor: COLORS.black },
                  }}
                >
                  {inWishlist ? (
                    <Favorite sx={{ color: '#E57373' }} />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
              </Box>

              {/* Promises */}
              <Box sx={{ borderTop: `1px solid ${COLORS.gray[100]}`, pt: 3 }}>
                {PROMISES.map(({ icon: Icon, text }) => (
                  <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Icon sx={{ fontSize: 16, color: COLORS.gold }} />
                    <Typography variant="caption" sx={{ color: COLORS.muted, letterSpacing: '0.04em' }}>
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ mt: 10 }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              borderBottom: `1px solid ${COLORS.gray[100]}`,
              '& .MuiTab-root': { letterSpacing: '0.1em', fontSize: '0.75rem', textTransform: 'uppercase' },
              '& .MuiTabs-indicator': { backgroundColor: COLORS.black, height: 1 },
            }}
          >
            <Tab label="Description" />
            <Tab label="Details" />
            <Tab label="Reviews" />
          </Tabs>

          <Box sx={{ pt: 4, maxWidth: 720 }}>
            {activeTab === 0 && (
              <Typography sx={{ color: COLORS.muted, lineHeight: 1.9, letterSpacing: '0.02em' }}>
                {product.description}
              </Typography>
            )}
            {activeTab === 1 && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>SKU:</strong> {product.sku}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Weight:</strong> {product.weight ? `${product.weight} kg` : 'N/A'}</Typography>
                {product.tags && product.tags.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                    {product.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" sx={{ borderRadius: 0 }} />
                    ))}
                  </Box>
                )}
              </Box>
            )}
            {activeTab === 2 && (
              <Box>
                {reviews.length === 0 ? (
                  <Typography sx={{ color: COLORS.muted, fontStyle: 'italic', mb: 3 }}>
                    No reviews yet. Be the first to review this product.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                    {reviews.map((review) => (
                      <Box key={review.id} sx={{ borderBottom: `1px solid ${COLORS.gray[100]}`, pb: 2 }}>
                        <Rating value={review.rating} readOnly size="small" sx={{ mb: 1, '& .MuiRating-iconFilled': { color: COLORS.gold } }} />
                        {review.title && <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{review.title}</Typography>}
                        <Typography variant="body2" sx={{ color: COLORS.muted, lineHeight: 1.8 }}>{review.comment}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
                {isAuthenticated && (
                  <Box component="form" onSubmit={(e) => { e.preventDefault(); reviewMutation.mutate(); }} sx={{ mt: 2 }}>
                    <Typography variant="overline" sx={{ color: COLORS.gold, letterSpacing: '0.12em', mb: 2, display: 'block' }}>Write a Review</Typography>
                    <Rating value={reviewForm.rating} onChange={(_, v) => setReviewForm((f) => ({ ...f, rating: v || 5 }))} sx={{ mb: 2, '& .MuiRating-iconFilled': { color: COLORS.gold } }} />
                    <TextField fullWidth label="Title (optional)" value={reviewForm.title} onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 0 } }} />
                    <TextField fullWidth multiline rows={3} label="Your review" required value={reviewForm.comment} onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 0 } }} />
                    <Button type="submit" variant="contained" disabled={reviewMutation.isPending || !reviewForm.comment.trim()} sx={{ borderRadius: 0, backgroundColor: COLORS.black }}>Submit Review</Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {relatedProducts.length > 0 && (
          <Box sx={{ mt: 12 }}>
            <ScrollReveal>
              <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300, mb: 4, textAlign: 'center' }}>
                You May Also Like
              </Typography>
            </ScrollReveal>
            <Grid container spacing={3}>
              {relatedProducts.map((p, i) => (
                <Grid key={p.id} size={{ xs: 6, sm: 4, md: 3 }}>
                  <ProductCard product={p} index={i} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </>
  );
}
