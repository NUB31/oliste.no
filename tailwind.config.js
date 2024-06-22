/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				dark: {
					50: 'var(--dark-50)',
					100: 'var(--dark-100)',
					200: 'var(--dark-200)',
					300: 'var(--dark-300)',
					400: 'var(--dark-400)',
					500: 'var(--dark-500)',
					600: 'var(--dark-600)',
					700: 'var(--dark-700)',
					800: 'var(--dark-800)',
					900: 'var(--dark-900)',
					950: 'var(--dark-950)'
				},
				light: {
					50: 'var(--light-50)',
					100: 'var(--light-100)',
					200: 'var(--light-200)',
					300: 'var(--light-300)',
					400: 'var(--light-400)',
					500: 'var(--light-500)',
					600: 'var(--light-600)',
					700: 'var(--light-700)',
					800: 'var(--light-800)',
					900: 'var(--light-900)',
					950: 'var(--light-950)'
				},
				blue: {
					50: 'var(--blue-50)',
					100: 'var(--blue-100)',
					200: 'var(--blue-200)',
					300: 'var(--blue-300)',
					400: 'var(--blue-400)',
					500: 'var(--blue-500)',
					600: 'var(--blue-600)',
					700: 'var(--blue-700)',
					800: 'var(--blue-800)',
					900: 'var(--blue-900)',
					950: 'var(--blue-950)'
				}
			}
		}
	},
	plugins: []
};
