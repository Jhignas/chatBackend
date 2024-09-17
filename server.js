const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an express app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get("/", (req, res) => res.sendFile(__dirname + "/socketIoClient.html"));

// Handle new WebSocket connections
io.on('connection', (socket) => {
    io.emit('message', "a new player joined!");
    socket.broadcast.emit(socket.id + ": Hello");
    console.log('User connected: ', socket.id);
    io.emit("user connected: " + socket.id);

    // Listen for messages from the client
    socket.on('message', (data) => {
        console.log('Message received:', data);
        io.emit("message", socket.id + ": " + data);

        // Forward the message to the recipient
        // io.to(data.receiverId).emit('receiveMessage', {
        //     senderId: socket.id,
        //     message: data.message,
        // });
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        io.emit("user disconnected: " + socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});