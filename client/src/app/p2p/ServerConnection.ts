import {Events} from "./Events";
import * as DetectRTC from 'detectrtc';
import {environment} from "../../environments/environment";

export class ServerConnection {

  private socket;
  private reconnectTimer;

  public connect() {
    clearTimeout(this.reconnectTimer);
    if (this.isConnected() || this.isConnecting()) return;
    const ws = new WebSocket(this.endpoint());
    ws.binaryType = 'arraybuffer';
    ws.onopen = e => console.log('WS: server connected');
    ws.onmessage = e => this.onMessage(e.data);
    ws.onclose = e => this.onDisconnect();
    ws.onerror = e => console.error(e);
    this.socket = ws;
  }

  onMessage(msg) {
    msg = JSON.parse(msg);
    switch (msg.type) {
      case 'peers':
        Events.fire('peers', msg.peers);
        break;
      case 'peer-joined':
        Events.fire('peer-joined', msg.peer);
        break;
      case 'peer-left':
        Events.fire('peer-left', msg.peerId);
        break;
      case 'signal':
        Events.fire('signal', msg);
        break;
      case 'ping':
        this.send({ type: 'pong' });
        break;
      default:
        console.error('WS: unkown message type', msg);
    }
  }

  send(message) {
    if (!this.isConnected()) return;
    this.socket.send(JSON.stringify(message));
  }

  endpoint() {
    const protocol = (environment.protocol == 'https') ? 'wss' : 'ws';
    const webrtc = DetectRTC.isWebRTCSupported ? '/webrtc' : '/fallback';
    const url = protocol + '://' + environment.serverUri + '/server' + webrtc;
    return url;
  }

  public disconnect() {
    this.send({ type: 'disconnect' });
    this.socket.onclose = null;
    this.socket.close();
  }

  onDisconnect() {
    console.log('WS: server disconnected');
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(_ => this.connect(), 5000);
  }

  isConnected() {
    return this.socket && this.socket.readyState === this.socket.OPEN;
  }

  isConnecting() {
    return this.socket && this.socket.readyState === this.socket.CONNECTING;
  }

}
