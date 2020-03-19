import {environment} from "../../environments/environment";
import {Host} from "./Host";
import {DiscoveryInterface} from "./DiscoveryInterface";
import isRTCSupported from 'webrtcsupported';
import * as NoSleep from 'nosleep.js';
import Timeout = NodeJS.Timeout;
import {RTCPeer} from "./RTCPeer";
const ab2str = require('arraybuffer-to-string');

export class Discovery {

  private readonly callback: DiscoveryInterface;
  private peerList: Array<Host> = [];
  private connectionEstablished: boolean = false;
  private websocket: WebSocket;
  private interval: Timeout;
  private noSleep = new NoSleep();

  constructor(callback: DiscoveryInterface) {
    this.callback = callback;
  }

  private onMessage(message): void {
    const msg = JSON.parse(message);
    switch (msg.type) {
      case 'host-update':
        this.onPeers(msg.data);
        break;
      case 'text':
        console.log(msg.data.msg);
        break;
      case 'disconnect':
        this.disconnect();
        break;
      case 'signal':
        this.peerList.forEach((value, index) => {
          if (value.getId() === msg.data.from) {
            if (value.getPeer() instanceof RTCPeer) {
              (value.getPeer() as RTCPeer).onServerMessage(msg.data);
            }
          }
        });
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

    this.interval = this.keepAlive();
    this.noSleep.enable();
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

    clearInterval(this.interval);
    this.noSleep.disable();
  }

  private onPeers(data): void {
    this.peerList = [];
    data.forEach((value, index) => {
      const host = new Host(this, isRTCSupported());
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

  public keepAlive(): Timeout {
    return setInterval(() => this.send('ping', null), 500);
  }

}
