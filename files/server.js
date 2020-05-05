"use strict";
const http = require("http");
const fileSystem = require("fs");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    let readStream = fileSystem.createReadStream(__dirname + "/src/index.html");
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
  } else {
    fileSystem.readFile(__dirname + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
