'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingBag,
  People,
  Pending,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { adminAPI } from '@/lib/api/admin';
import { COLORS } from '@/lib/theme';

function StatCard({
  title,
  value,
  icon: Icon,
  prefix = '',
  suffix = '',
  trend,
  index = 0,
}: {
  title: string;
  value: number | undefined;
  icon: any;
  prefix?: string;
  suffix?: string;
  trend?: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3.5,
          border: `1px solid ${COLORS.gray[100]}`,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 0,
          height: '100%',
          '&:hover': {
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', backgroundColor: COLORS.gold }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="caption" sx={{ color: COLORS.muted, letterSpacing: '0.1em', mb: 1, display: 'block' }}>
              {title.toUpperCase()}
            </Typography>
            {value === undefined ? (
              <Skeleton width={100} height={40} />
            ) : (
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: '2.2rem',
                  fontWeight: 400,
                  lineHeight: 1,
                  mb: 0.5,
                }}
              >
                {prefix}{typeof value === 'number' && value >= 1000
                  ? `${(value / 1000).toFixed(1)}k`
                  : value?.toFixed(value < 100 ? 2 : 0)
                }{suffix}
              </Typography>
            )}
            {trend && (
              <Typography variant="caption" sx={{ color: COLORS.success }}>
                {trend}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              backgroundColor: `${COLORS.gold}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ color: COLORS.gold, fontSize: 22 }} />
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminAPI.dashboard(30),
    refetchInterval: 60000,
  });

  const stats = data?.data?.data?.stats;
  const chart = data?.data?.data?.chart || [];

  const maxRevenue = Math.max(...chart.map((d: any) => d.revenue), 1);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: { xs: '1.8rem', md: '2.5rem' },
            fontWeight: 300,
            mb: 0.5,
          }}
        >
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.muted }}>
          Welcome back. Here's what's happening with your store.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Revenue" value={stats?.total_revenue} icon={TrendingUp} prefix="$" index={0} trend="↑ This month" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Orders" value={stats?.total_orders} icon={ShoppingBag} index={1} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Today's Revenue" value={stats?.today_revenue} icon={TrendingUp} prefix="$" index={2} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Pending Orders" value={stats?.pending_orders} icon={Pending} index={3} />
        </Grid>
      </Grid>

      {/* Revenue Chart */}
      <Paper elevation={0} sx={{ p: 4, border: `1px solid ${COLORS.gray[100]}`, borderRadius: 0, mb: 4 }}>
        <Typography
          sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', fontWeight: 300, mb: 3 }}
        >
          Revenue Overview
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {chart.length === 0 ? (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', height: 160 }}>
            {Array.from({ length: 15 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" sx={{ flex: 1, height: `${Math.random() * 80 + 20}%` }} />
            ))}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: 180 }}>
            {chart.map((point: any, i: number) => {
              const h = (point.revenue / maxRevenue) * 100;
              return (
                <motion.div
                  key={point.date}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.5, delay: i * 0.02 }}
                  title={`$${point.revenue.toFixed(2)}`}
                  style={{
                    flex: 1,
                    backgroundColor: COLORS.gold,
                    opacity: 0.7,
                    cursor: 'pointer',
                    minWidth: 4,
                    borderRadius: 0,
                  }}
                />
              );
            })}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" sx={{ color: COLORS.gray[400] }}>
            {chart[0]?.date || 'Start'}
          </Typography>
          <Typography variant="caption" sx={{ color: COLORS.gray[400] }}>
            {chart[chart.length - 1]?.date || 'Today'}
          </Typography>
        </Box>
      </Paper>

      {/* Quick Links */}
      <Grid container spacing={2}>
        {[
          { label: 'Manage Products', href: '/admin/products', count: null },
          { label: 'View Orders', href: '/admin/orders', count: stats?.pending_orders },
          { label: 'Customers', href: '/admin/customers', count: null },
          { label: 'Coupons', href: '/admin/coupons', count: null },
        ].map((item) => (
          <Grid key={item.href} size={{ xs: 6, md: 3 }}>
            <Paper
              component="a"
              href={item.href}
              elevation={0}
              sx={{
                display: 'block',
                p: 2.5,
                border: `1px solid ${COLORS.gray[100]}`,
                borderRadius: 0,
                textDecoration: 'none',
                textAlign: 'center',
                '&:hover': {
                  borderColor: COLORS.gold,
                  '& .quick-label': { color: COLORS.gold },
                },
                transition: 'all 0.2s',
              }}
            >
              <Typography
                className="quick-label"
                variant="caption"
                sx={{ letterSpacing: '0.1em', fontWeight: 500, textTransform: 'uppercase', transition: 'color 0.2s' }}
              >
                {item.label}
              </Typography>
              {item.count !== null && (
                <Typography
                  sx={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.8rem', color: COLORS.gold, mt: 0.5 }}
                >
                  {item.count}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
