'use client';

import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { COLORS } from '@/lib/theme';
import type { StaticPageContent } from '@/lib/content/staticPages';

export default function StaticPageView({ content }: { content: StaticPageContent }) {
  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md" sx={{ px: { xs: 3, md: 6 } }}>
        <ScrollReveal>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Typography
              component="h1"
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontWeight: 300,
                fontSize: { xs: '2.4rem', md: '3.2rem' },
                letterSpacing: '0.04em',
                mb: 2,
              }}
            >
              {content.title}
            </Typography>
            {content.subtitle && (
              <Typography sx={{ color: COLORS.muted, mb: 6, letterSpacing: '0.04em', lineHeight: 1.7 }}>
                {content.subtitle}
              </Typography>
            )}
          </motion.div>
        </ScrollReveal>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {content.sections.map((section, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <Box>
                {section.heading && (
                  <Typography
                    variant="overline"
                    sx={{ color: COLORS.gold, letterSpacing: '0.15em', display: 'block', mb: 1.5 }}
                  >
                    {section.heading}
                  </Typography>
                )}
                <Typography sx={{ color: COLORS.muted, lineHeight: 1.9, letterSpacing: '0.02em' }}>
                  {section.body}
                </Typography>
              </Box>
            </ScrollReveal>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
