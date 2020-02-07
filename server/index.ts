import * as ws from 'ws';
import { Host } from './host';

export class HotDropServer {

  private webSocketServer;
  private rooms;

  constructor(discoveryPort: number) {
    const WebSocket = ws;
    this.webSocketServer = new WebSocket.Server({port: discoveryPort});
    this.webSocketServer.on('connection', (socket, request) => {
      this.onConnection(new Host(socket, request));
    });
    this.webSocketServer.on('headers', (headers, response) => {
      this.onHeaders(headers, response);
    });

    this.rooms = {};
    console.log('HotDrop Server running on port', discoveryPort);
  }

  private onConnection(host: Host): void {
    this.joinRoom(host);
    host.socket.on('message', message => {
      this.onMessage(host, message);
    });
    this.keepAlive(host);
  }

  private onHeaders(headers, response): void {
    if (response.headers.cookie && response.headers.cookie.indexOf('hostid=') > -1) { return; }
    response.hostId = Host.getUUID();
    headers.push('Set-Cookie: hostid=' + response.hostId);
  }

  private onMessage(sender: Host, message): void {
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
    }

    if (message.to && this.rooms[sender.ip]) {
      const recipientId = message.to;
      const recipient = this.rooms[sender.ip][recipientId];
      delete message.to;
      message.sender = sender.id;
      return this.send(recipient, message);
    }
  }

  private joinRoom(host: Host): void {
    if (!this.rooms[host.ip]) {
      this.rooms[host.ip] = {};
    }

    for (const otherHostId in this.rooms[host.ip]) {
      if (this.rooms[host.ip].hasOwnProperty(otherHostId)) {
        const otherHost = this.rooms[host.ip][otherHostId];
        this.send(otherHost, {
          type: 'host-joined',
          host: host.getInfo()
        });
      }
    }

    const otherHosts = [];
    for (const otherHostId in this.rooms[host.ip]) {
      if (this.rooms[host.ip].hasOwnProperty(otherHostId)) {
        otherHosts.push(this.rooms[host.ip][otherHostId].getInfo());
      }
    }

    this.send(host, {
      type: 'hosts',
      hosts: otherHosts
    });

    this.rooms[host.ip][host.id] = host;
  }

  private leaveRoom(host: Host): void {
    if (!this.rooms[host.ip] || !this.rooms[host.ip][host.id]) { return; }
    this.cancelKeepAlive(this.rooms[host.ip][host.id]);

    delete this.rooms[host.ip][host.id];
    host.socket.terminate().then(t => { console.log("socket terminated"); });
    if (!Object.keys(this.rooms[host.ip].length)) {
      delete this.rooms[host.ip];
    } else {
      for (const otherHostId in this.rooms[host.ip]) {
        if (this.rooms[host.ip].hasOwnProperty(otherHostId)) {
          const otherHost = this.rooms[host.ip][otherHostId];
          this.send(otherHost, {
            type: 'host-left',
            hostId: host.id
          });
        }
      }
    }
  }

  private send(host: Host, message): void {
    if (!host) { return console.error('undefined host'); }
    if (this.webSocketServer.readyState !== this.webSocketServer.OPEN) { return console.error('Socket closed'); }
    message = JSON.stringify(message);
    host.socket.send(message).catch(error => error ? console.log(error) : '');
  }

  private keepAlive(host: Host): void {
    this.cancelKeepAlive(host);
    const timeout = 10000;
    if (!host.lastBeat) {
      host.lastBeat = Date.now();
    }
    if (Date.now() - host.lastBeat > 2 * timeout) {
      return this.leaveRoom(host);
    }

    this.send(host, { type: 'ping' });
    host.timerId = setTimeout(() => this.keepAlive(host), timeout);
  }

  private cancelKeepAlive(host: Host): void {
    if (host && host.timerId) {
      clearTimeout(host.timerId);
    }
  }

}

const server = new HotDropServer(3000);
