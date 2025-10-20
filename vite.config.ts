import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 5199,
		open: true,
		proxy: {
			'/api': {
				target: 'http://8.155.53.210:3001/api',
				changeOrigin: true,
				ws: false,
			},
		},
	},
	preview: {
		port: 5173,
		open: true,
	},
	build: {
		outDir: 'build',
	},
});