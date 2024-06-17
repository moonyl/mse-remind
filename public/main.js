const videoEl = document.getElementById('stream');
const mediaSource = new MediaSource();
videoEl.src = URL.createObjectURL(mediaSource);

const mime = 'video/mp4; codecs="avc1.4D0029"';

mediaSource.addEventListener('sourceopen', function (e) {
    console.log('sourceopen: ' + mediaSource.readyState);
    buffer = mediaSource.addSourceBuffer(mime);
    buffer.mode = 'sequence';

    socket = io(null, { transports: ['websocket'] });
    socket.emit('message', 'start');

    socket.on('segment', function (data) {
        console.dir(data.segment);
        const segData = new Uint8Array(data);
        // console.dir(segData);
        // buffer.appendBuffer(segData);
        buffer.appendBuffer(segData);
    });
});