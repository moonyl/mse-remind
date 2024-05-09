'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
app.use('/', express.static('public'))

http.listen(3000, () => {
    console.log('listening on localhost:3000');
})