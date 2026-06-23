'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Divider,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { ordersAPI } from '@/lib/api/orders';
import { COLORS } from '@/lib/theme';
import type { Order } from '@/types';

const statusColor = (status: string): any => {
  switch (status) {
    case 'delivered': return 'success';
    case 'shipped': return 'info';
    case 'processing': return 'warning';
    case 'cancelled': return 'error';
    default: return 'default';
  }
};

function OrderRow({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ pl: 3 }}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"Cormorant Garamond", serif' }}>
            #{order.order_number}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="caption" sx={{ color: COLORS.muted }}>
            {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            ${order.total.toFixed(2)}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip
            label={order.status.toUpperCase()}
            size="small"
            color={statusColor(order.status)}
            sx={{ borderRadius: 0, fontSize: '0.6rem', height: 20, fontWeight: 500 }}
          />
        </TableCell>
        <TableCell sx={{ pr: 3 }}>
          <Chip
            label={order.payment_status.toUpperCase()}
            size="small"
            variant="outlined"
            color={order.payment_status === 'paid' ? 'success' : 'default'}
            sx={{ borderRadius: 0, fontSize: '0.6rem', height: 20 }}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, pb: 2 }}>
              <Typography variant="overline" sx={{ color: COLORS.gold, letterSpacing: '0.12em', mb: 2, display: 'block' }}>
                Items Ordered
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: COLORS.muted, fontSize: '0.75rem', fontWeight: 600 }}>Product</TableCell>
                    <TableCell align="right" sx={{ color: COLORS.muted, fontSize: '0.75rem', fontWeight: 600 }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ color: COLORS.muted, fontSize: '0.75rem', fontWeight: 600 }}>Unit Price</TableCell>
                    <TableCell align="right" sx={{ color: COLORS.muted, fontSize: '0.75rem', fontWeight: 600 }}>Total Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell component="th" scope="row" sx={{ py: 1.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.name}</Typography>
                        {item.attributes && Object.entries(item.attributes).map(([k, v]) => (
                          <Typography key={k} variant="caption" sx={{ color: COLORS.muted, display: 'block' }}>
                            {k}: {v}
                          </Typography>
                        ))}
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                      <TableCell align="right">${item.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 6, px: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: COLORS.muted, display: 'block' }}>Subtotal</Typography>
                  <Typography variant="caption" sx={{ color: COLORS.muted, display: 'block' }}>Shipping</Typography>
                  {order.discount > 0 && <Typography variant="caption" sx={{ color: COLORS.success, display: 'block' }}>Discount</Typography>}
                  <Typography variant="body2" sx={{ fontWeight: 600, display: 'block', mt: 0.5 }}>Total</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ display: 'block' }}>${order.subtotal.toFixed(2)}</Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>${order.shipping_cost.toFixed(2)}</Typography>
                  {order.discount > 0 && <Typography variant="caption" sx={{ color: COLORS.success, display: 'block' }}>-${order.discount.toFixed(2)}</Typography>}
                  <Typography variant="body2" sx={{ fontWeight: 600, display: 'block', mt: 0.5 }}>${order.total.toFixed(2)}</Typography>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => ordersAPI.getMyOrders(),
  });

  const orders = data?.data?.data || [];

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: '1.5rem',
          letterSpacing: '0.05em',
          mb: 4,
          fontWeight: 400,
        }}
      >
        Order History
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={60} />
          ))}
        </Box>
      ) : orders.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: COLORS.muted }}>
            You haven't placed any orders yet.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${COLORS.gray[100]}`, borderRadius: 0 }}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow sx={{ backgroundColor: COLORS.gray[50] }}>
                <TableCell style={{ width: 60 }} />
                <TableCell sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.1em', fontWeight: 600 }}>Order #</TableCell>
                <TableCell sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.1em', fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.1em', fontWeight: 600 }}>Total</TableCell>
                <TableCell sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.1em', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.1em', fontWeight: 600 }}>Payment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
