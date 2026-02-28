import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, existsSync, renameSync, rmSync, readFileSync, writeFileSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'fix-extension-files',
      closeBundle() {
        // Copy content.css to dist
        copyFileSync('src/content.css', 'dist/content.css');
        
        // Move popup.html from dist/src/ to dist/ if needed
        if (existsSync('dist/src/popup.html')) {
          renameSync('dist/src/popup.html', 'dist/popup.html');
          rmSync('dist/src', { recursive: true });
        }
        
        // Fix popup.html paths to be relative (remove any ../ or / prefixes)
        if (existsSync('dist/popup.html')) {
          let html = readFileSync('dist/popup.html', 'utf-8');
          html = html.replace(/src="\.\.\/([^"]+)"/g, 'src="$1"');
          html = html.replace(/href="\.\.\/([^"]+)"/g, 'href="$1"');
          html = html.replace(/src="\/([^"]+)"/g, 'src="$1"');
          html = html.replace(/href="\/([^"]+)"/g, 'href="$1"');
          // Remove crossorigin attributes which can cause issues in extensions
          html = html.replace(/ crossorigin/g, '');
          writeFileSync('dist/popup.html', html);
        }
      }
    }
  ],
  base: './',
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup.html'),
        background: resolve(__dirname, 'src/background.js'),
        content: resolve(__dirname, 'src/content.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
  },
  server: {
    port: 3000,
  },
});