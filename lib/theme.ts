'use client';
import { createTheme } from '@mui/material/styles';

// LUXE Design Tokens
export const COLORS = {
  black: '#0A0A0A',
  white: '#FAFAFA',
  gold: '#C9A96E',
  goldLight: '#D9BC8C',
  goldDark: '#A8854A',
  gray: {
    50: '#F9F9F9',
    100: '#F0F0F0',
    200: '#E0E0E0',
    300: '#C0C0C0',
    400: '#9E9E9E',
    500: '#757575',
    600: '#616161',
    700: '#424242',
    800: '#212121',
    900: '#121212',
  },
  muted: '#6B6B6B',
  error: '#D32F2F',
  success: '#388E3C',
};

declare module '@mui/material/styles' {
  interface Palette {
    gold: Palette['primary'];
  }
  interface PaletteOptions {
    gold?: PaletteOptions['primary'];
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: COLORS.black,
      light: COLORS.gray[700],
      dark: '#000000',
      contrastText: COLORS.white,
    },
    secondary: {
      main: COLORS.gold,
      light: COLORS.goldLight,
      dark: COLORS.goldDark,
      contrastText: COLORS.white,
    },
    background: {
      default: COLORS.white,
      paper: '#FFFFFF',
    },
    text: {
      primary: COLORS.black,
      secondary: COLORS.muted,
    },
    divider: COLORS.gray[200],
    error: { main: COLORS.error },
    success: { main: COLORS.success },
  },

  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontFamily: '"Cormorant Garamond", "Georgia", serif',
      fontWeight: 300,
      fontSize: 'clamp(2.5rem, 6vw, 5rem)',
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    h2: {
      fontFamily: '"Cormorant Garamond", "Georgia", serif',
      fontWeight: 300,
      fontSize: 'clamp(2rem, 4vw, 3.5rem)',
      letterSpacing: '-0.01em',
      lineHeight: 1.15,
    },
    h3: {
      fontFamily: '"Cormorant Garamond", "Georgia", serif',
      fontWeight: 400,
      fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
      letterSpacing: '0',
      lineHeight: 1.2,
    },
    h4: {
      fontFamily: '"Cormorant Garamond", "Georgia", serif',
      fontWeight: 500,
      fontSize: 'clamp(1.25rem, 2vw, 2rem)',
      letterSpacing: '0.01em',
    },
    h5: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      letterSpacing: '0.02em',
    },
    h6: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      fontSize: '1rem',
      letterSpacing: '0.04em',
    },
    subtitle1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      letterSpacing: '0.02em',
      lineHeight: 1.6,
    },
    subtitle2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      fontSize: '0.875rem',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    },
    overline: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.7rem',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      fontWeight: 500,
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.8rem',
      fontWeight: 500,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
    },
  },

  shape: {
    borderRadius: 0, // Sharp corners for luxury aesthetic
  },

  spacing: 8,

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '12px 32px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '& fieldset': {
              borderColor: COLORS.gray[300],
            },
            '&:hover fieldset': {
              borderColor: COLORS.black,
            },
            '&.Mui-focused fieldset': {
              borderColor: COLORS.black,
              borderWidth: '1px',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: COLORS.black,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          border: `1px solid ${COLORS.gray[100]}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.7rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: COLORS.gray[100],
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;
