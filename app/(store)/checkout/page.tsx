'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';
import { cartAPI } from '@/lib/api/cart';
import { ordersAPI } from '@/lib/api/orders';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { COLORS } from '@/lib/theme';

const schema = z.object({
  label: z.string(),
  full_name: z.string().min(2, 'Required'),
  phone: z.string().min(7, 'Required'),
  street: z.string().min(5, 'Required'),
  city: z.string().min(2, 'Required'),
  state: z.string().min(2, 'Required'),
  zip_code: z.string().min(3, 'Required'),
  country: z.string().min(2, 'Required'),
  note: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [placingOrder, setPlacingOrder] = useState(false);

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { cart, subtotal, clearLocalCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { label: 'Home', country: 'United States' },
  });

  const shipping = subtotal >= 150 ? 0 : 9.99;
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const { data } = await ordersAPI.validateCoupon(couponCode, subtotal);
      if (data.data.valid) {
        setDiscount(data.data.discount_amount);
        setCouponMsg(`✓ Coupon applied: -$${data.data.discount_amount.toFixed(2)}`);
      } else {
        setCouponMsg(data.data.message || 'Invalid coupon');
        setDiscount(0);
      }
    } catch {
      setCouponMsg('Failed to validate coupon');
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!isAuthenticated) {
      enqueueSnackbar('Please sign in to place an order', { variant: 'warning' });
      router.push('/login');
      return;
    }
    if (!cart?.items?.length) {
      enqueueSnackbar('Your cart is empty', { variant: 'warning' });
      return;
    }

    setPlacingOrder(true);
    try {
      const orderData = {
        items: cart.items.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          attributes: item.attributes,
        })),
        shipping_address: {
          label: data.label,
          full_name: data.full_name,
          phone: data.phone,
          street: data.street,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code,
          country: data.country,
          is_default: false,
        },
        payment_method: paymentMethod,
        coupon_code: couponCode || undefined,
        note: data.note,
      };

      const res = await ordersAPI.createOrder(orderData);
      clearLocalCart();
      enqueueSnackbar('Order placed successfully!', { variant: 'success' });
      router.push(`/account/orders?success=${res.data.data.order_number}`);
    } catch (err: any) {
      enqueueSnackbar(err?.response?.data?.error || 'Failed to place order', { variant: 'error' });
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 8 } }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography className="section-tag" sx={{ mb: 1 }}>Secure Checkout</Typography>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 300 }}>
            Complete Your Order
          </Typography>
        </Box>

        <Grid container spacing={6}>
          {/* Left: Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              {/* Contact */}
              <Typography variant="overline" sx={{ color: COLORS.gold, letterSpacing: '0.15em', mb: 3, display: 'block' }}>
                Shipping Address
              </Typography>

              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Full Name" {...register('full_name')} error={!!errors.full_name} helperText={errors.full_name?.message} id="checkout-name" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Phone Number" {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message} id="checkout-phone" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Street Address" {...register('street')} error={!!errors.street} helperText={errors.street?.message} id="checkout-street" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="City" {...register('city')} error={!!errors.city} helperText={errors.city?.message} id="checkout-city" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField fullWidth label="State" {...register('state')} error={!!errors.state} helperText={errors.state?.message} id="checkout-state" />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <TextField fullWidth label="ZIP Code" {...register('zip_code')} error={!!errors.zip_code} helperText={errors.zip_code?.message} id="checkout-zip" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Country" {...register('country')} error={!!errors.country} helperText={errors.country?.message} id="checkout-country" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Order Note (Optional)" multiline rows={2} {...register('note')} id="checkout-note" />
                </Grid>
              </Grid>

              {/* Payment */}
              <Box sx={{ mt: 5 }}>
                <Typography variant="overline" sx={{ color: COLORS.gold, letterSpacing: '0.15em', mb: 3, display: 'block' }}>
                  Payment Method
                </Typography>
                <FormControl>
                  <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'online')}>
                    <FormControlLabel
                      value="cod"
                      control={<Radio sx={{ '&.Mui-checked': { color: COLORS.black } }} />}
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Cash on Delivery</Typography>
                          <Typography variant="caption" sx={{ color: COLORS.muted }}>Pay when your order arrives</Typography>
                        </Box>
                      }
                      sx={{
                        border: `1px solid ${paymentMethod === 'cod' ? COLORS.black : COLORS.gray[200]}`,
                        borderRadius: 0,
                        px: 2,
                        py: 1.5,
                        mb: 1.5,
                        mr: 0,
                        width: '100%',
                        transition: 'border-color 0.2s',
                      }}
                    />
                    <FormControlLabel
                      value="online"
                      control={<Radio sx={{ '&.Mui-checked': { color: COLORS.black } }} />}
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Online Payment</Typography>
                          <Typography variant="caption" sx={{ color: COLORS.muted }}>Credit/Debit Card (coming soon)</Typography>
                        </Box>
                      }
                      sx={{
                        border: `1px solid ${paymentMethod === 'online' ? COLORS.black : COLORS.gray[200]}`,
                        borderRadius: 0,
                        px: 2,
                        py: 1.5,
                        mr: 0,
                        width: '100%',
                        transition: 'border-color 0.2s',
                        opacity: 0.6,
                      }}
                      disabled
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={placingOrder}
                id="place-order-button"
                sx={{
                  mt: 5,
                  py: 2.5,
                  backgroundColor: COLORS.black,
                  color: COLORS.white,
                  fontSize: '0.85rem',
                  letterSpacing: '0.15em',
                  '&:hover': { backgroundColor: COLORS.gray[800] },
                }}
              >
                {placingOrder ? <CircularProgress size={22} color="inherit" /> : 'Place Order'}
              </Button>
            </Box>
          </Grid>

          {/* Right: Summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                position: { md: 'sticky' },
                top: 100,
                border: `1px solid ${COLORS.gray[100]}`,
                p: 4,
              }}
            >
              <Typography variant="overline" sx={{ color: COLORS.gold, letterSpacing: '0.15em', mb: 3, display: 'block' }}>
                Order Summary
              </Typography>

              {/* Items */}
              <Box sx={{ mb: 3 }}>
                {cart?.items?.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.25 }}>{item.name}</Typography>
                      <Typography variant="caption" sx={{ color: COLORS.muted }}>Qty: {item.quantity}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, ml: 2 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Coupon */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                    id="coupon-input"
                  />
                  <Button
                    variant="outlined"
                    onClick={handleApplyCoupon}
                    sx={{ borderRadius: 0, borderColor: COLORS.black, color: COLORS.black, px: 3, flexShrink: 0 }}
                    id="apply-coupon"
                  >
                    Apply
                  </Button>
                </Box>
                {couponMsg && (
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.75,
                      display: 'block',
                      color: discount > 0 ? COLORS.success : COLORS.error,
                    }}
                  >
                    {couponMsg}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Totals */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: COLORS.muted }}>Subtotal</Typography>
                <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
              </Box>
              {discount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: COLORS.success }}>Discount</Typography>
                  <Typography variant="body2" sx={{ color: COLORS.success }}>-${discount.toFixed(2)}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" sx={{ color: COLORS.muted }}>Shipping</Typography>
                <Typography variant="body2">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Total</Typography>
                <Typography
                  sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', fontWeight: 400 }}
                >
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
