const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware pour analyser les données JSON dans les requêtes POST
app.use(bodyParser.json());

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send a welcome message to the client
  socket.emit('welcome', 'Welcome to the Socket.IO server!');

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Point d'API pour recevoir des notifications HTTP
app.post('/message', (req, res) => {
  const data = req.body;
  console.log('Received message from Laravel:', data);

  // Émettre l'événement 'notification' sur tous les clients
  io.emit('notification', data.message);

  // Répondre à la requête HTTP
  res.status(200).json({ message: 'Notification sent successfully' });
});

server.listen(3000, () => {
  console.log('Socket.IO server is running on port 3000');
});
