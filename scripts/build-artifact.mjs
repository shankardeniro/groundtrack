// Converts the single-file build (dist/index.html) into an Artifact-ready
// fragment: the Artifact host supplies its own <!doctype>/<html>/<head>/<body>
// skeleton, so the page ships as <title> + <style> + body content only.
// Run via: npm run build:single
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');

// Google Fonts links survive the Artifact CSP (the one allowed external host).
const fontLinks = [...html.matchAll(/<link[^>]*fonts\.g[^>]*>/g)].map((m) => m[0]);
const styles = [...html.matchAll(/<style[^>]*>[\s\S]*?<\/style>/g)].map((m) => m[0]);
const scripts = [...html.matchAll(/<script[^>]*>[\s\S]*?<\/script>/g)].map((m) => m[0]);
const bodyStart = html.indexOf('<body>');
const bodyEnd = html.lastIndexOf('</body>');
if (bodyStart === -1 || bodyEnd === -1) throw new Error('dist/index.html has no <body> — build with --mode single first');
const body = html
  .slice(bodyStart + '<body>'.length, bodyEnd)
  .replace(/<script[^>]*>[\s\S]*?<\/script>/g, '') // scripts re-appended at the end
  .trim();
if (scripts.length === 0) throw new Error('no inline <script> found — build with --mode single first');

const out = `<title>Orbital Atlas</title>\n${fontLinks.join('\n')}\n${styles.join('\n')}\n${body}\n${scripts.join('\n')}\n`;
writeFileSync('dist/orbital-atlas-artifact.html', out);
console.log(`dist/orbital-atlas-artifact.html written (${(out.length / 1024 / 1024).toFixed(2)} MB)`);
