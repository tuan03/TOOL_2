const http = require('http');
const httpProxy = require('http-proxy');

// Khởi tạo proxy
const proxy = httpProxy.createProxyServer({});

// Server đích muốn chuyển tiếp request tới
const target = 'http://hunght1890.com/'; // Đổi thành URL bạn muốn proxy tới

// Tạo server proxy
const server = http.createServer((req, res) => {
  console.log(`Proxying request: ${req.method} ${req.url}`);
  
  // Chuyển tiếp request tới target
  proxy.web(req, res, { target }, (err) => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error: ' + err.message);
  });
});

// Lắng nghe ở cổng 8080
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT} and forwarding to ${target}`);
});
