const http = require('node:http');
const express = require('express');

const app = express();
const server = http.createServer(app);

app.use(express.static('public'));
app.use(express.static('dist'));

server.listen(3000, () => {
  console.log('listening');
});
