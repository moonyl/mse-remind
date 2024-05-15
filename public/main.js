const videoEl = document.getElementById('stream');
const mediaSource = new MediaSource();
videoEl.src = URL.createObjectURL(mediaSource);

mediaSource.addEventListener('sourceopen', function (e) {
    console.log('sourceopen: ' + mediaSource.readyState);
    buffer = mediaSource.addSourceBuffer(mime);
    buffer.mode = 'sequence';

    socket = io(null, { transports: ['websocket'] });
    socket.emit('message', 'start');
});