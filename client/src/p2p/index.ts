import {Events} from './events';
import * as DetectRTC from 'detectrtc';

export class ServerConnection {

  private reconnectTimer;
  private socket: WebSocket;

  constructor() {
    Events.on('beforeunload', e => this.disconnect());
    Events.on('pagehide', e => this.disconnect());
  }

  public connect() {
    console.log("connecting...");
    clearTimeout(this.reconnectTimer);
    if (this.isConnected() || this.isConnecting()) { return; }
    const ws: WebSocket = new WebSocket(this.endpoint());
    ws.onopen = ev => console.log('WS: server connected');
    ws.onmessage = ev => this.onMessage(ev.data);
    ws.onclose = ev => this.onDisconnect();
    ws.onerror = ev => console.log(ev);
    this.socket = ws;
  }

  private onMessage(message): void {
    try {
      message = JSON.parse(message);
    } catch (e) {
      return;
    }
    console.log('WS:', message);
    switch (message.type) {
      case 'hosts':
        Events.fire('hosts', message.hosts);
        break;
      case 'host-joined':
        Events.fire('host-joined', message.host);
        break;
      case 'host-left':
        Events.fire('host-left', message.hostId);
        break;
      case 'signal':
        Events.fire('signal', message);
        break;
      case 'ping':
        this.send({ type: 'pong'});
        break;
      default:
        console.error('WS: unknown message type', message);
    }
  }

  private send(message): void {
    if (!this.isConnected()) { return; }
    this.socket.send(JSON.stringify(message));
  }

  private endpoint(): string {
    const protocol = location.protocol.startsWith('https') ? 'wss' : 'ws';
    const webRTC = DetectRTC.isWebRTCSupported ? '/webrtc' : '/fallback';
    return protocol + '://' + location.host + '/server' + webRTC;
  }

  private disconnect(): void {
    this.send({ type: 'disconnect' });
    this.socket.onclose = null;
    this.socket.close();
  }

  private onDisconnect(): void {
    console.log('WS: server disconnected');
    Events.fire('notify-user', 'connection lost. Retry in 5 seconds...');
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(_ => this.connect(), 5000);
  }

  private isConnected(): boolean {
    return this.socket && this.socket.readyState === this.socket.OPEN;
  }

  private isConnecting(): boolean {
    return this.socket && this.socket.readyState === this.socket.CONNECTING;
  }
}
