import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const changelog = JSON.parse(readFileSync('./CHANGELOG.json', 'utf-8'));

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
        TanStackRouterVite({
            routesDirectory: 'resources/js/routes',
            generatedRouteTree: 'resources/js/routeTree.gen.ts',
        }),
    ],
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version),
        __APP_CHANGELOG__: JSON.stringify(changelog),
    },
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
