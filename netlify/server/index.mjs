import { get } from 'node:http';
import app from '../../server/server.js';

if (process.env.NETLIFY_DEV === 'true') {
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();

    const upstream = get({ hostname: '127.0.0.1', port: 5173, path: req.originalUrl, method: req.method }, (response) => {
      res.writeHead(response.statusCode, response.headers);
      response.pipe(res);
    });
    upstream.on('error', () => {
      if (res.headersSent) res.destroy();
      else res.sendStatus(502);
    });
  });
}

export const config = { path: ['/api', '/api/*'] };
export default app;
