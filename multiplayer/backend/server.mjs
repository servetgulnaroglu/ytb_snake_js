import express from 'express';
import http from 'http';

import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import lobby from '../scripts/lobby.mjs';

const app = express();
const httpServer = http.Server(app);
const io = new Server(httpServer);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// select port according to environment
const port = process.env.PORT || 3000;

// listen to port 3000
httpServer.listen(port, function () {
    // serve frontend game
    app.use("/frontend", express.static(path.join(__dirname, '..', 'frontend')));

    app.use("/scripts", express.static(path.join(__dirname, '..', 'scripts')));

});

// initialize socket io
io.on('connection', function (socket) {
    // emit user id
    socket.emit('connection', socket.id);
    console.log(`user ${socket.id} connected`);
    // create room
    socket.on('createRoom', function (gameSettings) {
        
        const roomId = lobby.createRoom(socket.id, gameSettings);
        lobby.joinRoom(roomId, socket.id);

        // emit room id
        socket.emit('createRoom', roomId);
        console.log(`${socket.id} created room ${roomId}`);
    });

    // join room
    socket.on('joinRoom', function (roomId) {
        lobby.joinRoom(roomId, socket.id);
        socket.emit("joinRoom", roomId);
        console.log(`${socket.id} joined room ${roomId}`);
    });

    // leave room
    socket.on('leaveRoom', function (roomId) {
        lobby.leaveRoom(roomId, socket.id);
        socket.emit("leaveRoom", roomId);
        console.log(`${socket.id} left room ${roomId}`);
    });

    // update state
    socket.on('updateState', function (roomId) {
        const state = lobby.updateState(roomId);
        socket.emit("updateState", state);   
        
    });

    // move snake
    socket.on('moveSnake', function (settings) {
         
        lobby.moveSnake(settings.roomId, socket.id, settings.key);
        socket.emit("moveSnake", settings);
         
    });
    
     

});

