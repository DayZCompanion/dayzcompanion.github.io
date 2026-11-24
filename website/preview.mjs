import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { languages, pages, route } from './registry.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const routes = new Set(pages.flatMap(page => languages.map(lang => route(page.id, lang))));
const standalone = new Set(['/404.html', '/robots.txt', '/sitemap.xml', '/CNAME', '/favicon.ico',
  '/yandex_3619f933c4b60809.html']);
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
};

const server = createServer(async (request, response) => {
  response.setHeader('X-Robots-Tag', 'noindex');
  response.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  const path = new URL(request.url, 'http://localhost').pathname;
  if (!path.endsWith('/') && routes.has(path + '/')) {
    const query = new URL(request.url, 'http://localhost').search;
    response.writeHead(308, { Location: path + '/' + query }).end();
    return;
  }

  let file, status = path === '/404.html' ? 404 : 200;
  if (routes.has(path)) file = path + 'index.html';
  if (standalone.has(path) || /^\/assets\/(?:[\w-]+\/)*[\w.-]+$/.test(path) && basename(path) !== '..') file = path;
  let data;
  try {
    if (file) data = await readFile(join(root, file.slice(1)));
  } catch (error) {
    if (error.code !== 'ENOENT') console.error(error.message);
  }
  if (!data) {
    file = '/404.html';
    status = 404;
    data = await readFile(join(root, '404.html'));
  }
  const extension = extname(file);
  if (extension === '.html') {
    data = Buffer.from(data.toString().replace(/<!-- production-metrika -->.*?<!-- \/production-metrika -->/gs, ''));
  }
  response.writeHead(status, {
    'Content-Type': mime[extension] ?? 'text/plain; charset=utf-8',
    'Content-Length': data.length,
  });
  response.end(request.method === 'HEAD' ? undefined : data);
});

server.listen(Number(process.argv[2] ?? 18170), '127.0.0.1', () => {
  console.log('Local: http://127.0.0.1:' + server.address().port + '/');
});
