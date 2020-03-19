import * as WebSocket from 'ws';
import {Peer} from "./Peer";

export class HotDropServer {

    private websocketServer: WebSocket.Server;
    private socketList: Array<WebSocket> = [];
    private peerList: Array<Peer> = [];

    constructor(port: number = 3241) {
        this.websocketServer = new WebSocket.Server({ port: port });
        this.websocketServer.on('connection', (socket, request) => this.onConnect(socket, request));
    }

    private onConnect(socket: WebSocket, request: any): void {
        this.socketList.push(socket);
        this.peerList.push(new Peer(request));
        this.hostUpdate();

        socket.on('close', () => this.onDisconnect(socket));
        socket.on('message', (message) => this.onMessage(socket, message));
    }

    private onDisconnect(socket: WebSocket): void {
        const splicePos = this.socketList.indexOf(socket);
        this.socketList.splice(splicePos, 1);
        this.peerList.splice(splicePos, 1);
        return this.hostUpdate();
    }

    private onMessage(sender, message): void {
        let msg = message;
        try {
            msg = JSON.parse(message);
        } catch (ignored) { }

        switch (msg.type) {
            case 'disconnect':
                this.onDisconnect(sender);
                break;
            case 'host-request':
                this.hostRequest(sender);
                break;
        }
    }

    private hostUpdate(): void {
        this.socketList.forEach((value, index) => {
            value.send(JSON.stringify({
                type: 'host-update',
                data: this.filteredPeerList(value)
            }));
        });
    }

    private hostRequest(sender): void {
        sender.send(JSON.stringify({
            type: 'host-update',
            data: this.filteredPeerList(sender)
        }));
    }

    private filteredPeerList(socket: WebSocket): Array<Peer> {
        const clone: Array<Peer> = Object.assign([], this.peerList);
        const splicePos = this.socketList.indexOf(socket);
        clone.splice(splicePos, 1);
        return clone;
    }
}

const server = new HotDropServer(3241);
