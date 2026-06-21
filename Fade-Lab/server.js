const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 4177);
const root = __dirname;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

http.createServer((req, res) => {
  const cleanPath = req.url.split("?")[0];
  const urlPath = cleanPath === "/" ? "/index.html" : cleanPath;
  const filePath = path.normalize(path.join(root, urlPath));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "text/plain" });
    res.end(data);
  });
}).listen(port, () => {
  console.log(`Fade Lab running at http://localhost:${port}`);
});
