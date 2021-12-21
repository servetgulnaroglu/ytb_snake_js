const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path')
const lobby = require('../scripts/multiplayer/lobby.js');

// select port according to environment
const port = process.env.PORT || 3000;

// listen to port 3000
http.listen(port, function () {
    // serve frontend game
    app.use(express.static(path.join(__dirname, '..', 'frontend')));
    app.use("/scripts", express.static(path.join(__dirname, '..', 'scripts')));
     
});

// initialize socket io
io.on('connection', function (socket) {
    // emit user id
    socket.emit('userId', socket.id);

    // create room
    socket.on('createRoom', function (gameSettings) {
        const roomId = lobby.createRoom(socket.id, gameSettings);
        lobby.joinRoom(roomId, socket.id);
        // emit room id
        socket.emit('roomId', roomId);
    });

    // join room
    socket.on('joinRoom', function (roomId) {
        lobby.joinRoom(roomId, socket.id);
       
    });

    // leave room
    socket.on('leaveRoom', function (roomId) {
        lobby.leaveRoom(roomId, socket.id);
       
    });

    // update state
    socket.on('updateState', function (roomId) {
        const state = lobby.updateState(roomId);
        // broadcast state
        socket.broadcast.to(roomId).emit('state', state);
    });

    // move snake
    socket.on('moveSnake', function (roomId, playerId, direction) {
        lobby.moveSnake(roomId, playerId, direction);
    });

    
});

