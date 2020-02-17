import { createServer } from 'http';
import * as SocketIO from 'socket.io';
import * as P2P from 'socket.io-p2p-server';

const server = createServer();
const p2pServer = P2P.Server;
const io = SocketIO(server);

const ioPeerMsg = 'peer-msg';
const ioGoPrivate = 'go-private';

server.listen(3241, function () {
    console.log('Listening on 3241');
});
io.use(p2pServer);

io.on('connection', function (socket) {
    socket.on(ioPeerMsg, function (data) {
        console.log('Message from peer: %s', data);
        socket.broadcast.emit(ioPeerMsg, data);
    });

    socket.on(ioGoPrivate, function (data) {
        socket.broadcast.emit(ioGoPrivate, data);
    });
});
