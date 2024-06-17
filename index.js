'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { spawn } = require('child_process');
const ffmpeg = spawn('ffmpeg', ['-loglevel', 'debug', '-re', '-i', 'https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_720p_h264.mov', '-an', '-c:v', 'copy', '-f', 'mp4', '-movflags', '+frag_keyframe+empty_moov+default_base_moof', 'pipe:1'], { stdio: ['ignore', 'pipe', 'inherit'] });

const Mp4Frag = require('mp4frag');
const mp4frag = new Mp4Frag();

ffmpeg.on('error', (error) => {
    console.log('error', error);
});

ffmpeg.on('exit', (code, signal) => {
    console.log('exit', code, signal);
});

ffmpeg.stdio[1].pipe(mp4frag);
mp4frag.on('segment', data => { console.log({ data }); });

app.use('/', express.static('public'));
app.use('/socket.io', express.static('node_modules/socket.io/client-dist'))

io.on('connection', socket => {
    console.log("connection");
    //ffmpeg.stdio[1].pipe(process.stdout);
    function start() {
        if (mp4frag.initialization) {
            socket.emit('segment', mp4frag.initialization);
            mp4frag.on('segment', emitSegment);
        } else {
            socket.emit('message', 'init segment not ready yet, reload page');
        }
    }

    function emitSegment(data) {
        console.log("emitSegment");
        console.dir(data);
        socket.emit('segment', data.segment);
    }

    socket.on('message', (msg) => {
        switch (msg) {
            case 'start':
                start();
                break;
        }
    });
});

http.listen(3000, () => {
    console.log('listening on localhost:3000');
})