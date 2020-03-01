import { createServer } from 'http';
import * as SocketIO from 'socket.io';
import * as P2P from 'socket.io-p2p-server';
import {Socket} from "socket.io";
import {PeerData} from "./PeerData";
import Timeout = NodeJS.Timeout;

const server = createServer();
const p2pServer = P2P.Server;
const io = SocketIO(server);

const ioPeerConnect = 'connection';
const ioPeerDisconnect = 'disconnect';

const ioPeerDataRequest = 'peer-data-request';
const ioPeerDataResponse = 'peer-data-response';
const ioPeerDataUpdate = 'peer-data-update';
const ioPeerListChanged = 'peer-list-changed';
const ioPeerListRequest = 'peer-list-request';
const ioPeerListResponse = 'peer-list-response';

const port = 3241;

const peerList: Array<Socket> = [];
const peerData: Array<PeerData> = [];

server.listen(port, function () {
    console.log('Server started on %s', port);
});
io.use(p2pServer);

let pingPeerInterval: Timeout = pingPeerIntervalSetup();

io.on(ioPeerConnect, function (socket) {
    peerList.push(socket);

    socket.on(ioPeerDisconnect, function () {
        const i = peerList.indexOf(socket);

        for (let index = peerData.length -1; index >= 0; index--) {
            if (peerData[index].peerListId === i) {
                peerData.splice(index, 1);
            }
        }

        peerList.splice(i, 1);
    });
    socket.emit(ioPeerDataRequest, null);

    socket.on(ioPeerDataResponse, function (responseData) {
        const i = peerList.indexOf(socket);
        const peer = new PeerData();
        peer.peerListId = i;
        peer.data = responseData;
        peer.peerId = socket.id;
        peerData.push(peer);
    });

    socket.on(ioPeerDataUpdate, function (updateData) {
        const i = peerList.indexOf(socket);

        peerData.forEach((value, index) => {
            if (value.peerListId === i) {
                const peer = new PeerData();
                peer.peerListId = i;
                peer.data = updateData;
                peer.peerId = socket.id;
                peerData[index] = peer;
            }
        });

        io.emit(ioPeerListChanged, null);
        pingPeerInterval = pingPeerIntervalSetup();
    });

    socket.on(ioPeerListRequest, function () {
        socket.emit(ioPeerListResponse, filterPeerData(socket));
    });
});

function filterPeerData(socket: Socket): Array<{}> {
    const clonedArray: Array<PeerData> = Object.assign([], peerData);
    for(let i = clonedArray.length -1; i >= 0; i--) {
        if (clonedArray[i] !== null && clonedArray[i].data !== null) {
            if (!clonedArray[i].data.searching || checkSameSocket(peerList[clonedArray[i].peerListId], socket)) {
                clonedArray.splice(i, 1);
            }
        } else {
            clonedArray.splice(i, 1);
        }
    }

    return squash(clonedArray);
}

function squash(arr){
    let tmp = [];
    for(let i = 0; i < arr.length; i++){
        if(tmp.indexOf(arr[i]) == -1){
            tmp.push(arr[i]);
        }
    }
    return tmp;
}

function checkSameSocket(socket1: Socket, socket2: Socket): boolean {
    if (socket1 !== undefined && socket2 !== undefined) {
        if (socket1 === socket2) {
            return true;
        } else if (socket1.id === socket2.id) {
            return true;
        }
    }

    return false;
}

function pingPeerIntervalSetup(): Timeout {
    if (pingPeerInterval !== null
        && pingPeerInterval !== undefined) {
        clearInterval(pingPeerInterval);
    }
    return  setInterval(function () {
        io.emit(ioPeerListChanged, null);
    }, 5000);
}
