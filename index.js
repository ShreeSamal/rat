const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.send('Hello from Node.js!');
});

io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('message', (data) => {
    console.log('Received message from Flutter:', data);
    socket.emit('message', 'Hello from Node.js');
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

http.listen(3005, () => {
  console.log('Node.js server running on port 3000');
});
