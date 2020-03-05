import * as WebSocket from 'ws';
import { Peer } from "./Peer";

export class HotDropServer {

    private webSocketServer;
    private rooms = {};

    constructor(socketPort: number = 3241) {
        this.webSocketServer = new WebSocket.Server({ port: socketPort });
        this.webSocketServer.on('connection', (socket, request) => {
            this.onConnection(new Peer(socket, request));
        });
        this.webSocketServer.on('headers', (headers, request) => {
            this.onHeaders(headers, request);
        });

        console.log('Server started on %s', socketPort);
    }

    onConnection(peer: Peer): void {
        this.joinRoom(peer);
        peer.getSocket().on('message', message => this.onMessage(peer, message));
        this.keepAlive(peer);
    }

    onHeaders(headers, response): void {
        if (response.headers.cookie && response.headers.cookie.indexOf('peerid=') > -1) return;
        response.peerId = Peer.uuid;
        headers.push('Set-Cookie: peerid=' + response.peerId);
    }

    onMessage(sender: Peer, message): void {
        try {
            message = JSON.parse(message);
        } catch (e) {
            return;
        }

        switch (message.type) {
            case 'disconnect':
                this.leaveRoom(sender);
                break;
            case 'pong':
                sender.lastBeat = Date.now();
                break;
        }

        if (message.to && this.rooms[sender.getIP()]) {
            const recipientId = message.to;
            const recipient: Peer = this.rooms[sender.getIP()][recipientId];
            delete message.to;

            message.sender = sender.getId();
            this.send(recipient, message);
            return;
        }
    }

    joinRoom(peer: Peer): void {
        if (!this.rooms[peer.getIP()]) {
            this.rooms[peer.getIP()] = {};
        }

        for (const otherPeerId in this.rooms[peer.getIP()]) {
            if (this.rooms[peer.getIP()].hasOwnProperty(otherPeerId)) {
                const otherPeer = this.rooms[peer.getIP()][otherPeerId];
                this.send(otherPeer, {
                    type: 'peer-joined',
                    peer: peer.getInfo()
                });
            }
        }

        const otherPeers = [];
        for (const otherPeerId in this.rooms[peer.getIP()]) {
            if (this.rooms[peer.getIP()].hasOwnProperty(otherPeerId)) {
                otherPeers.push(this.rooms[peer.getIP()][otherPeerId].getInfo());
            }
        }

        this.send(peer, {
            type: 'peers',
            peers: otherPeers
        });

        this.rooms[peer.getIP()][peer.getId()] = peer;
    }

    leaveRoom(peer: Peer): void {
        if (!this.rooms[peer.getIP()] || !this.rooms[peer.getIP()][peer.getId()]) return;
        this.cancelKeepAlive(this.rooms[peer.getIP()][peer.getId()]);

        delete this.rooms[peer.getIP()][peer.getId()];

        peer.getSocket().terminate();

        if (Object.keys(this.rooms[peer.getIP()]).length) {
            delete this.rooms[peer.getIP()];
        } else {
            for (const otherPeerId in this.rooms[peer.getIP()]) {
                let otherPeer: Peer;
                if (this.rooms[peer.getIP()].hasOwnProperty(otherPeerId)) {
                    otherPeer = this.rooms[peer.getIP()][otherPeerId];
                    this.send(otherPeer, {
                        type: 'peer-left',
                        peerId: peer.getId()
                    });
                }
            }
        }
    }

    send(peer: Peer, message): void {
        if (!peer) return console.error('undefined peer');
        if (this.webSocketServer.readyState !== this.webSocketServer.OPEN) return console.error('Socket is closed');
        message = JSON.stringify(message);
        peer.getSocket().send(message, err => err ? console.log(err) : '');
    }

    keepAlive(peer: Peer): void {
        this.cancelKeepAlive(peer);
        let timeout = 10000;
        if (!peer.lastBeat) {
            peer.lastBeat = Date.now();
        }

        if (Date.now() - peer.lastBeat > 2 * timeout) {
            this.leaveRoom(peer);
            return
        }

        this.send(peer, {
            type: 'ping'
        });

        peer.timerId = setTimeout(() => this.keepAlive(peer), timeout);
    }

    cancelKeepAlive(peer: Peer): void {
        if (peer && peer.timerId) {
            clearTimeout(peer.timerId);
        }
    }
}

const server = new HotDropServer(parseInt(process.env.PORT) || 3241);
