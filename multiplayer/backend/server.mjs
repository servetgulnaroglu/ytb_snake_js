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
        
        const roomId = lobby.createRoom(gameSettings);
        const joinRoomResponse = lobby.joinRoom(roomId, gameSettings.playerId);

        // emit room id
        socket.emit('createRoom', joinRoomResponse );
        console.log(`${joinRoomResponse.playerId} created room ${joinRoomResponse.roomId}`);
    });

    // join room
    socket.on('joinRoom', function (data) {
        const response = lobby.joinRoom(data.roomId, data.playerId);
        socket.emit("joinRoom", response );
        console.log(`${response .playerId} joined room ${response.roomId}`);
    });

    // leave room
    socket.on('leaveRoom', function (data) {
        lobby.leaveRoom(data.roomId, data.playerId);
        socket.emit("leaveRoom", data);
        console.log(`${data.playerId} left room ${data.roomId}`);
    });

    // update state
    socket.on('updateState', function (roomId) {
        const state = lobby.updateState(roomId);
        socket.emit("updateState", state);   
        
    });

    // move snake
    socket.on('keyPressed', function (settings) {
         
        lobby.keyPressed(settings.roomId, settings.key, settings.playerId);
        socket.emit("keyPressed", settings);
         
    });
 
     

});

