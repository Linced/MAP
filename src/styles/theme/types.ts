// Theme Types
// ===========
// TypeScript types for theme variables

// Color Types
export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

export type ThemeColors = {
  // Background colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    hover: string;
  };
  
  // Accent colors
  accent: {
    primary: string;
    success: string;
    danger: string;
    warning: string;
    info: string;
  };
  
  // Text colors
  text: {
    primary: string;
    secondary: string;
    muted: string;
    disabled: string;
  };
  
  // Border colors
  border: {
    primary: string;
    secondary: string;
    focus: string;
  };
  
  // Chart colors
  chart: {
    green: string;
    red: string;
    blue: string;
    purple: string;
    yellow: string;
  };
  
  // Status colors
  status: {
    online: string;
    offline: string;
    busy: string;
    error: string;
  };
  
  // Overlay colors
  overlay: {
    light: string;
    medium: string;
    heavy: string;
    dark: string;
  };
};

// Typography Types
export type FontFamily = {
  primary: string;
  mono: string;
  display: string;
};

export type FontSize = {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
};

export type LineHeight = {
  tight: number;
  normal: number;
  relaxed: number;
};

export type FontWeight = {
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
  extrabold: number;
};

export type Typography = {
  fontFamily: FontFamily;
  fontSize: FontSize;
  lineHeight: LineHeight;
  fontWeight: FontWeight;
};

// Spacing Types
export type Spacing = {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
};

export type ContainerSizes = {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
};

export type Breakpoints = {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
};

export type Layout = {
  spacing: Spacing;
  container: ContainerSizes;
  breakpoints: Breakpoints;
};

// Animation Types
export type Easing = {
  inOut: string;
  out: string;
  in: string;
};

export type Duration = {
  75: string;
  100: string;
  150: string;
  200: string;
  300: string;
  500: string;
  700: string;
  1000: string;
};

export type Animation = {
  easing: Easing;
  duration: Duration;
};

// Theme Type
export interface Theme {
  colors: ThemeColors;
  typography: Typography;
  layout: Layout;
  animation: Animation;
}

// Default theme export
const theme: Theme = {
  colors: {
    background: {
      primary: 'var(--background-primary)',
      secondary: 'var(--background-secondary)',
      tertiary: 'var(--background-tertiary)',
      hover: 'var(--background-hover)',
    },
    accent: {
      primary: 'var(--accent-primary)',
      success: 'var(--accent-success)',
      danger: 'var(--accent-danger)',
      warning: 'var(--accent-warning)',
      info: 'var(--accent-info)',
    },
    text: {
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
      muted: 'var(--text-muted)',
      disabled: 'var(--text-disabled)',
    },
    border: {
      primary: 'var(--border-primary)',
      secondary: 'var(--border-secondary)',
      focus: 'var(--border-focus)',
    },
    chart: {
      green: 'var(--chart-green)',
      red: 'var(--chart-red)',
      blue: 'var(--chart-blue)',
      purple: 'var(--chart-purple)',
      yellow: 'var(--chart-yellow)',
    },
    status: {
      online: 'var(--status-online)',
      offline: 'var(--status-offline)',
      busy: 'var(--status-busy)',
      error: 'var(--status-error)',
    },
    overlay: {
      light: 'var(--overlay-light)',
      medium: 'var(--overlay-medium)',
      heavy: 'var(--overlay-heavy)',
      dark: 'var(--overlay-dark)',
    },
  },
  typography: {
    fontFamily: {
      primary: 'var(--font-primary)',
      mono: 'var(--font-mono)',
      display: 'var(--font-display)',
    },
    fontSize: {
      xs: 'var(--text-xs)',
      sm: 'var(--text-sm)',
      base: 'var(--text-base)',
      lg: 'var(--text-lg)',
      xl: 'var(--text-xl)',
      '2xl': 'var(--text-2xl)',
      '3xl': 'var(--text-3xl)',
      '4xl': 'var(--text-4xl)',
      '5xl': 'var(--text-5xl)',
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
  layout: {
    spacing: {
      0: 'var(--space-0)',
      1: 'var(--space-1)',
      2: 'var(--space-2)',
      3: 'var(--space-3)',
      4: 'var(--space-4)',
      5: 'var(--space-5)',
      6: 'var(--space-6)',
      8: 'var(--space-8)',
      10: 'var(--space-10)',
      12: 'var(--space-12)',
      16: 'var(--space-16)',
      20: 'var(--space-20)',
      24: 'var(--space-24)',
    },
    container: {
      sm: 'var(--container-sm)',
      md: 'var(--container-md)',
      lg: 'var(--container-lg)',
      xl: 'var(--container-xl)',
      '2xl': 'var(--container-2xl)',
    },
    breakpoints: {
      sm: 'var(--breakpoint-sm)',
      md: 'var(--breakpoint-md)',
      lg: 'var(--breakpoint-lg)',
      xl: 'var(--breakpoint-xl)',
      '2xl': 'var(--breakpoint-2xl)',
    },
  },
  animation: {
    easing: {
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
    },
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
  },
};

export default theme;
