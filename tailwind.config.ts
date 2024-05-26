import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

const utilitiesPlugin = plugin(function ({ addUtilities }) {
  addUtilities({
    '.font-light': {
      fontWeight: '400',
      fontVariationSettings: '"wght" 450',
    },
    '.font-normal': {
      fontWeight: '500',
      fontVariationSettings: '"wght" 550',
    },
    '.font-medium': {
      fontWeight: '600',
      fontVariationSettings: '"wght" 650',
    },
    '.font-semibold': {
      fontWeight: '700',
      fontVariationSettings: '"wght" 750',
    },
    '.font-bold': {
      fontWeight: '800',
      fontVariationSettings: '"wght" 850',
    },
    '.font-optical-sizing-auto': {
      fontOpticalSizing: 'auto',
    },
  });
});

const config: Config = {
  content: [
    './src/app/(site)/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    borderRadius: {
      sm: '1.5rem',
      DEFAULT: '2.5rem',
    },
    extend: {
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        sans: [
          ['var(--font-nunito)', 'sans-serif', ...defaultTheme.fontFamily.sans],
          {
            fontVariationSettings: "'wght' 550",
          },
        ],
      },
      ringOffsetWidth: {
        '3': '3px',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [utilitiesPlugin],
};
export default config;
