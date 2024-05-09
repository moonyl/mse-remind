'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use('/', express.static('public'));
app.use('/socket.io', express.static('node_modules/socket.io/client-dist'))

io.on('connection', socket => {
    console.log("connection");
});

http.listen(3000, () => {
    console.log('listening on localhost:3000');
})