const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 5500);

const pageRoutes = {
  "/": "index.html",
  "/home": "index.html",
  "/hostels": "pages/hostels.html",
  "/facilities": "pages/facilities.html",
  "/gallery": "pages/gallery.html",
  "/distance": "pages/distance.html",
  "/contact": "pages/contact.html",
  "/admin": "pages/admin.html",
  "/admin/contact": "pages/admin-contact.html",
  "/admin/hostels": "pages/admin-hostels.html",
  "/admin/gallery": "pages/admin-gallery.html",
  "/admin/users": "pages/admin-users.html",
  "/elvy-stays": "pages/elvy-stays.html",
  "/hostel-praneeth1": "pages/hostel-praneeth1.html",
  "/hostel-praneeth2": "pages/hostel-praneeth2.html"
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function sendFile(res, absolutePath) {
  fs.readFile(absolutePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(absolutePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = requestUrl.pathname;

  // Keep URLs clean in development by redirecting legacy html paths.
  if (pathname.startsWith("/pages/") && pathname.endsWith(".html")) {
    const routeEntry = Object.entries(pageRoutes).find(([, filePath]) => `/${filePath}` === pathname);
    if (routeEntry) {
      const [cleanRoute] = routeEntry;
      const target = `${cleanRoute}${requestUrl.search}${requestUrl.hash}`;
      res.writeHead(302, { Location: target });
      res.end();
      return;
    }
  }

  const mappedPage = pageRoutes[pathname];
  if (mappedPage) {
    sendFile(res, path.join(root, mappedPage));
    return;
  }

  const safePath = path.normalize(pathname).replace(/^([.][.][/\\])+/, "");
  const absolutePath = path.join(root, safePath);

  if (!absolutePath.startsWith(root)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.stat(absolutePath, (error, stats) => {
    if (!error && stats.isFile()) {
      sendFile(res, absolutePath);
      return;
    }

    if (!error && stats.isDirectory()) {
      const indexPath = path.join(absolutePath, "index.html");
      sendFile(res, indexPath);
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  });
});

server.listen(port, () => {
  process.stdout.write(`Frontend server running on http://localhost:${port}\n`);
});
