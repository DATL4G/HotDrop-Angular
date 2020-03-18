import { createServer } from 'http';
import * as SocketIO from 'socket.io';
import * as P2P from 'socket.io-p2p-server';
import { Socket } from "socket.io";
import {Peer} from "./Peer";

const server = createServer();
let p2pServer = P2P.Server;
const io = SocketIO(server, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});

server.listen(3241, function () {
    console.log('Listening on 3241');
});
io.use(p2pServer);


const socketList: Array<Socket> = [];
const peerList: Array<Peer> = [];
const clients = [];

io.on('connection', function (socket: Socket, request) {
    socketList.push(socket);
    if (request !== undefined && request !== null) {
        peerList.push(new Peer(request));
    } else {
        peerList.push(new Peer(socket.request));
    }
    hostUpdate();
    clients[socket.id] = socket
    socket.join('room');
    p2pServer(socket, null, 'room');

    socket.on('disconnect', function () {
        const splicePos = socketList.indexOf(socket);
        socketList.splice(splicePos, 1);
        peerList.splice(splicePos, 1);

        hostUpdate();
    })

    socket.on('establish-webrtc', function (data) {
        peerList.forEach((value, index) => {
            if (value.getIP() === data.ip && value.getId() === data.id) {
                socketList[index].emit('establish-webrtc', data);
            }
        });
    });

    socket.on('peer-message', function (data) {
        console.log('sending data...');
        console.log(data);
        peerList.forEach((value, index) => {
            if (value.getIP() === data.ip && value.getId() === data.id) {
                console.log('found host, emitting...');
                socketList[index].emit('peer-message', data);
            }
        })
    });
});

function hostUpdate(): void {
    socketList.forEach((value, index) => {
        value.emit('host-update', filteredPeerList(value));
    });
}

function filteredPeerList(socket: Socket): Array<Peer> {
    const clone: Array<Peer> = Object.assign([], peerList);
    const splicePos = socketList.indexOf(socket);
    clone.splice(splicePos, 1);
    return clone;
}
