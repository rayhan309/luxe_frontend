'use client';

import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Skeleton, MenuItem, Select, FormControl, InputLabel, Rating,
} from '@mui/material';
import { Check, Delete } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { reviewsAPI } from '@/lib/api/reviews';
import { COLORS } from '@/lib/theme';

export default function AdminReviewsPage() {
  const [approvedFilter, setApprovedFilter] = useState('pending');
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', approvedFilter],
    queryFn: () => reviewsAPI.adminList({ approved: approvedFilter === 'all' ? undefined : approvedFilter }),
  });
  const reviews = data?.data?.data || [];

  const approveMutation = useMutation({
    mutationFn: (id: string) => reviewsAPI.adminApprove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }); enqueueSnackbar('Review approved', { variant: 'success' }); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => reviewsAPI.adminDelete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-reviews'] }); enqueueSnackbar('Review deleted', { variant: 'success' }); },
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
        <Box>
          <Typography sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300 }}>Reviews</Typography>
          <Typography variant="body2" sx={{ color: COLORS.muted }}>Moderate customer product reviews</Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={approvedFilter} onChange={(e) => setApprovedFilter(e.target.value)} label="Filter" sx={{ borderRadius: 0 }}>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="true">Approved</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${COLORS.gray[100]}`, borderRadius: 0 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: COLORS.gray[50] }}>
              {['Rating', 'Comment', 'Status', 'Date', 'Actions'].map((h) => (
                <TableCell key={h} sx={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: COLORS.muted }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? [...Array(5)].map((_, i) => <TableRow key={i}>{[...Array(5)].map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}</TableRow>) :
              reviews.length === 0 ? (
                <TableRow><TableCell colSpan={5} sx={{ textAlign: 'center', py: 6, color: COLORS.muted }}>No reviews found</TableCell></TableRow>
              ) : reviews.map((r) => (
                <TableRow key={r.id}>
                  <TableCell><Rating value={r.rating} readOnly size="small" /></TableCell>
                  <TableCell sx={{ maxWidth: 360 }}>
                    {r.title && <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{r.title}</Typography>}
                    <Typography variant="caption" sx={{ color: COLORS.muted }}>{r.comment}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={r.is_approved ? 'approved' : 'pending'} size="small" color={r.is_approved ? 'success' : 'warning'} sx={{ borderRadius: 0, fontSize: '0.65rem' }} />
                  </TableCell>
                  <TableCell><Typography variant="caption">{new Date(r.created_at).toLocaleDateString()}</Typography></TableCell>
                  <TableCell>
                    {!r.is_approved && (
                      <IconButton size="small" onClick={() => approveMutation.mutate(r.id)} title="Approve"><Check sx={{ fontSize: 16 }} /></IconButton>
                    )}
                    <IconButton size="small" onClick={() => window.confirm('Delete?') && deleteMutation.mutate(r.id)}><Delete sx={{ fontSize: 16 }} /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
