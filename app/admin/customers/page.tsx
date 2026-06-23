'use client';

import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Skeleton, TextField, InputAdornment,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api/admin';
import { COLORS } from '@/lib/theme';

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [page] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', search, page],
    queryFn: () => adminAPI.listCustomers({ search: search || undefined, page, limit: 20 }),
  });

  const customers = data?.data?.data || [];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300 }}>Customers</Typography>
        <Typography variant="body2" sx={{ color: COLORS.muted }}>Registered users and their activity</Typography>
      </Box>

      <TextField
        size="small"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18 }} /></InputAdornment> } }}
        sx={{ mb: 3, width: 320, '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
      />

      <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${COLORS.gray[100]}`, borderRadius: 0 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: COLORS.gray[50] }}>
              {['Name', 'Email', 'Role', 'Status', 'Joined'].map((h) => (
                <TableCell key={h} sx={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: COLORS.muted }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? [...Array(6)].map((_, i) => (
              <TableRow key={i}>{[...Array(5)].map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}</TableRow>
            )) : customers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.first_name} {user.last_name}</TableCell>
                <TableCell><Typography variant="caption">{user.email}</Typography></TableCell>
                <TableCell><Chip label={user.role} size="small" sx={{ borderRadius: 0, fontSize: '0.65rem' }} /></TableCell>
                <TableCell><Chip label={user.is_active ? 'active' : 'inactive'} size="small" color={user.is_active ? 'success' : 'default'} sx={{ borderRadius: 0, fontSize: '0.65rem' }} /></TableCell>
                <TableCell><Typography variant="caption" sx={{ color: COLORS.muted }}>{new Date(user.created_at).toLocaleDateString()}</Typography></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
