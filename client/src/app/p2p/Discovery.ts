import {environment} from "../../environments/environment";
import {Host} from "./Host";
import {DiscoveryInterface} from "./DiscoveryInterface";
import isRTCSupported from 'webrtcsupported';
const ab2str = require('arraybuffer-to-string');

export class Discovery {

  private readonly callback: DiscoveryInterface;
  private peerList: Array<Host> = [];
  private connectionEstablished: boolean = false;
  private websocket: WebSocket;

  constructor(callback: DiscoveryInterface) {
    this.callback = callback;
  }

  private onMessage(message): void {
    const msg = JSON.parse(message);
    console.log(message);
    switch (msg.type) {
      case 'host-update':
        this.onPeers(msg.data);
        break;
    }
  }

  private serverURI(): string {
    let support = '/fallback';
    if (isRTCSupported()) {
      support = '/webrtc';
    }
    return environment.websocketProtocol + '://' + environment.serverUri + '/server' + support;
  }

  public connect(): void {
    if (this.isConnected() || this.isConnecting()) return;

    this.websocket = new WebSocket(this.serverURI());
    this.websocket.binaryType = 'arraybuffer';
    this.websocket.onopen = e => this.callback.onConnected();
    this.websocket.onmessage = e => this.onMessage(e.data);
    this.websocket.onclose = e => this.disconnect();
  }

  public disconnect(): void {
    if (this.isConnected() || this.isConnecting()) {
      this.websocket.send(JSON.stringify({ type: 'disconnect' }));
    }
    this.websocket.onclose = null;
    this.websocket.close();
    this.websocket = null;
    this.callback.onDisconnected(this.connectionEstablished);
    this.connectionEstablished = false;
  }

  private onPeers(data): void {
    this.peerList = [];
    data.forEach((value, index) => {
      const host = new Host();
      host.applyFromMessage(value);
      this.peerList.push(host);
    });
    this.callback.onHostUpdate(this.peerList);
  }

  private isConnected(): boolean {
    return this.websocket && this.websocket.readyState === this.websocket.OPEN;
  }

  private isConnecting(): boolean {
    return this.websocket && this.websocket.readyState === this.websocket.CONNECTING;
  }

  public send(key: string, data: any) {
    this.websocket.send(JSON.stringify({
      type: key,
      data: data
    }));
  }

}
