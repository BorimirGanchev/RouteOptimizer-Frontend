import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    configureServer(server) {
      server.middlewares.use('/health', (req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('ok');
      });
    },
    allowedHosts: true,
    port: 5173,
    host: "0.0.0.0",
    hmr: {
      // Use your public domain for the WebSocket connection
      host: 'dev.route-optimizer.innovatebulgaria.com',
      // Force the browser to use the secure WebSocket protocol
      protocol: 'wss',
      // Use 443 because the browser connects via the HTTPS proxy/load balancer
      clientPort: 443,
    },
  },
})