import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

/**
 * DEV ONLY. The homepage links to real pages that live in the repository root
 * (../notes.html, ../geography/, ../games/ ...). During `npm run dev` / `preview`
 * this middleware serves those files read-only so every link can be followed
 * locally. It is not part of the production build.
 */
function serveRepoRoot(): Plugin {
  const root = path.resolve(__dirname, '..')
  const types: Record<string, string> = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.gif': 'image/gif',
  }
  const handler = (req: { url?: string }, res: any, next: () => void) => {
    const url = decodeURIComponent((req.url ?? '/').split('?')[0].split('#')[0])
    if (url === '/' || url.startsWith('/@') || url.startsWith('/src/') || url.startsWith('/node_modules/')) return next()
    let file = path.join(root, url)
    if (!file.startsWith(root) || file.includes(`${path.sep}website${path.sep}`)) return next()
    try {
      if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
      if (!fs.statSync(file).isFile()) return next()
    } catch { return next() }
    res.setHeader('Content-Type', types[path.extname(file).toLowerCase()] ?? 'application/octet-stream')
    fs.createReadStream(file).pipe(res)
  }
  return {
    name: 'serve-repo-root',
    configureServer(s) { s.middlewares.use(handler) },
    configurePreviewServer(s) { s.middlewares.use(handler) },
  }
}

// Custom domain (upscgurukul.online) serves from "/". Override with VITE_BASE=/repo-name/ if ever needed.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), serveRepoRoot()],
  build: { sourcemap: false, target: 'es2020' },
})
