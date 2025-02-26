import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			'primary-light': 'var(--primary-light)',
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			surface: 'var(--surface)',
  			'surface-2': 'var(--surface-2)',
  			border: 'hsl(var(--border))',
  			'border-light': 'var(--border-light)',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Montserrat',
  				'system-ui',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'sans-serif'
  			],
  			heading: [
  				'Oswald',
  				'Impact',
  				'sans-serif'
  			],
  			mono: [
  				'Roboto Mono',
  				'Consolas',
  				'monospace'
  			]
  		},
  		animation: {
  			fadeIn: 'fadeIn 0.5s ease-out forwards',
  			slideInRight: 'slideInRight 0.5s ease-out forwards',
  			'pulse-accent': 'pulse 2s infinite'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(10px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			slideInRight: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateX(30px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			pulse: {
  				'0%': {
  					boxShadow: '0 0 0 0 rgba(230, 57, 70, 0.7)'
  				},
  				'70%': {
  					boxShadow: '0 0 0 10px rgba(230, 57, 70, 0)'
  				},
  				'100%': {
  					boxShadow: '0 0 0 0 rgba(230, 57, 70, 0)'
  				}
  			}
  		},
  		transitionProperty: {
  			height: 'height',
  			spacing: 'margin, padding'
  		},
  		lineClamp: {
  			'1': '1',
  			'2': '2',
  			'3': '3'
  		},
  		boxShadow: {
  			soft: '0 4px 6px var(--shadow)',
  			hover: '0 10px 15px var(--shadow)'
  		},
  		borderRadius: {
  			xl: '0.75rem',
  			'2xl': '1rem',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
  darkMode: ['class', "class"],
} satisfies Config;
