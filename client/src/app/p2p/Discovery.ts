import * as SocketIO from 'socket.io-client';
import * as P2P from 'socket.io-p2p';
import {environment} from "../../environments/environment";
import {P2POptions} from "socket.io-p2p";
import {Host} from "./Host";
import {DiscoveryInterface} from "./DiscoveryInterface";
const ab2str = require('arraybuffer-to-string');

export class Discovery {

  private readonly callback: DiscoveryInterface;
  private peerList: Array<Host> = [];
  private connectionEstablished: boolean = false;

  private socket = SocketIO(environment.protocol + '://' + 'localhost:3241', {
    forceNew: true,
    reconnection: false,
    upgrade: true,
    autoConnect: false,
    secure: true
  });

  private opts: P2POptions = { autoUpgrade: false, numClients: 15 };

  private p2pSocket = new P2P(this.socket, this.opts, () => {
    this.connectionEstablished = true;
    this.callback.onConnected();
  });

  constructor(callback: DiscoveryInterface) {
    this.callback = callback;

    this.p2pSocket.on('host-update', (data) => this.onPeers(data));

    this.p2pSocket.on('establish-webrtc', () => {
      console.warn('getting dark');
      this.setPrivate();
    });

    this.p2pSocket.on('demolish-webrtc', () => {
      console.warn('getting light');
      this.setPublic();
    });

    this.p2pSocket.on('peer-message', (data) => {
      console.warn(ab2str(data));
      this.publicConnection(data);
    });

    this.p2pSocket.on('upgrade', (data) => {
      console.error('upgrade');
      console.log(data);
    });

    this.p2pSocket.on('peer-error', (data) => {
      console.log('peer-error');
      console.log(data);
    })
  }

  public connect(): void {
    this.socket.connect();
  }

  public disconnect(): void {
    this.p2pSocket.disconnect();
    this.socket.disconnect();
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

  public privateConnection(host: any): void {
    this.p2pSocket.emit('establish-webrtc', host);
    console.warn('going dark');
    this.setPrivate();
  }

  public publicConnection(host: any): void {
    this.p2pSocket.emit('demolish-webrtc', host);
    console.warn('going light');
    this.setPublic();
  }

  private setPrivate(): void {
    this.p2pSocket.useSockets = false;
    this.p2pSocket.usePeerConnection = true;
    this.p2pSocket.upgrade();
  }

  private setPublic(): void {
    this.p2pSocket.useSockets = true;
    this.p2pSocket.usePeerConnection = false;
    this.p2pSocket.upgrade();
  }

  public send(key: string, data: any) {
    this.p2pSocket.emit(key, data);
    console.log('sent');
  }

}
