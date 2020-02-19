import { createServer } from 'http';
import * as SocketIO from 'socket.io';
import * as P2P from 'socket.io-p2p-server';

const server = createServer();
const p2pServer = P2P.Server;
const io = SocketIO(server);

const ioPeerMsg = 'peer-msg';
const ioEnableWebRTC = 'enable-webrtc';
const ioPingPeers = 'ping-peers';
const port = 3241;

server.listen(port, function () {
    console.log('Server started on %s', port);
});
io.use(p2pServer);

io.on('connection', function (socket) {
    socket.on(ioPeerMsg, function (data) {
        socket.broadcast.emit(ioPeerMsg, data);
    });

    socket.on(ioEnableWebRTC, function (data) {
        socket.broadcast.emit(ioEnableWebRTC, data);
    });

    socket.on(ioPingPeers, function (data) {
        socket.broadcast.emit(ioPingPeers, data);
    })
});
