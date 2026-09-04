import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/index.css', 'resources/js/main.tsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    server: {
        host: true,
        cors: true,
        hmr: {
            host: '192.168.0.155',
        },
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
