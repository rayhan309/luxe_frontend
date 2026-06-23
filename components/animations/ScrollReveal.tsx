'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import React from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  once?: boolean;
}

const directionVariants = {
  up: { opacity: 0, y: 40 },
  down: { opacity: 0, y: -40 },
  left: { opacity: 0, x: -40 },
  right: { opacity: 0, x: 40 },
  none: { opacity: 0 },
};

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className,
  once = true,
}: ScrollRevealProps) {
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px',
  });

  return (
    <motion.div
      ref={ref}
      initial={directionVariants[direction]}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : directionVariants[direction]}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
