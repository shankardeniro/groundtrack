import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build` produces a normal multi-file bundle (for static hosting).
// `npm run build:single` inlines everything — JS, CSS, and the world-geometry
// JSON (as data: URIs) — into one self-contained dist/index.html, which is
// what the Claude Artifact deployment uses.
export default defineConfig(({ mode }) => ({
  plugins: mode === 'single' ? [viteSingleFile()] : [],
  build: mode === 'single' ? { assetsInlineLimit: 100_000_000 } : {},
}));
