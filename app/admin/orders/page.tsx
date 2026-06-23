'use client';

import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { ordersAPI } from '@/lib/api/orders';
import { COLORS } from '@/lib/theme';

const ORDER_STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusChipColor = (status: string): any => {
  switch (status) {
    case 'delivered': return 'success';
    case 'shipped': return 'info';
    case 'processing': return 'warning';
    case 'cancelled': return 'error';
    default: return 'default';
  }
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter, search, page],
    queryFn: () => ordersAPI.adminListOrders({
      status: statusFilter === 'all' ? undefined : statusFilter,
      search: search || undefined,
      page,
      limit: 20,
    }),
  });

  const orders = data?.data?.data || [];

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersAPI.adminUpdateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      enqueueSnackbar('Status updated', { variant: 'success' });
    },
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300 }}>
          Orders
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.muted }}>
          Manage and track all customer orders
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search order #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18 }} /></InputAdornment> } }}
          sx={{ width: 240, '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status" sx={{ borderRadius: 0 }}>
            {ORDER_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>{s === 'all' ? 'All Orders' : s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${COLORS.gray[100]}`, borderRadius: 0 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: COLORS.gray[50] }}>
              {['Order #', 'Customer', 'Date', 'Total', 'Status', 'Payment', 'Actions'].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    color: COLORS.muted,
                    borderBottom: `1px solid ${COLORS.gray[100]}`,
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}><Skeleton variant="text" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : orders.map((order: any) => (
                  <TableRow key={order.id} sx={{ '&:hover': { backgroundColor: COLORS.gray[50] } }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"Cormorant Garamond", serif' }}>
                        #{order.order_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{order.shipping_address?.full_name || '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: COLORS.muted }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>${order.total?.toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        size="small"
                        color={statusChipColor(order.status)}
                        sx={{ borderRadius: 0, fontSize: '0.65rem', height: 22 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.payment_status}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 0, fontSize: '0.65rem', height: 22 }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 130 }}>
                        <Select
                          value={order.status}
                          onChange={(e) => updateMutation.mutate({ id: order.id, status: e.target.value })}
                          sx={{ borderRadius: 0, fontSize: '0.8rem' }}
                        >
                          {ORDER_STATUSES.filter((s) => s !== 'all').map((s) => (
                            <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
