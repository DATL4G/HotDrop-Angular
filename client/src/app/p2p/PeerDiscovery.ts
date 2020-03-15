import {ServerConnection} from "./ServerConnection";
import {Events} from "./Events";
import {Host} from "./Host";
import {RTCPeer} from "./RTCPeer";
import {WSPeer} from "./WSPeer";
import * as DetectRTC from 'detectrtc';
import { fromString as uuidFrom } from 'uuidv4';

export class PeerDiscovery {

  private serverConnection = new ServerConnection();
  private connected: boolean = false;
  private peerList: Array<Host> = [];
  private rtcSupported = DetectRTC.isWebRTCSupported;
  private readonly updateContent: UpdateContent;

  constructor(updateContent: UpdateContent) {
    this.updateContent = updateContent;

    Events.on('peer-joined', e => this.onPeerJoined(e.detail));
    Events.on('peer-left', e => this.onPeerLeft(e.detail));
    Events.on('peers', e => this.onPeers(e.detail));
    Events.on('signal', e => this.onSignal(e.detail));
  }

  public connect(): void {
    this.connected = true;
    this.serverConnection.connect();
  }

  public disconnect(): void {
    this.serverConnection.disconnect();
    this.serverConnection.onDisconnect();
    this.connected = false;
    this.clearPeers();
  }

  private onPeerJoined(peer): void {
    console.log(peer);
    if (!this.connected) return;
    const peerUUID = uuidFrom(peer.id);

    this.peerList.forEach((value) => {
      const valueUUID = uuidFrom(value.getId());

      if (peer.id == value.getId() || peerUUID == valueUUID) {
        return;
      }
    });

    const host = new Host();
    host.applyFromMessage(peer);
    if (this.rtcSupported && peer.rtcSupported) {
      host.setPeer(new RTCPeer(this.serverConnection, host.getId()));
    } else {
      host.setPeer(new WSPeer(this.serverConnection, host.getId()));
    }

    this.peerList.push(host);

    this.updateContent.onUpdate(this.peerList);
  }

  private onPeerLeft(peerId): void {
    if (!this.connected) return;
    const peerUUID = uuidFrom(peerId);

    this.peerList.forEach((value, index) => {
      const valueUUID = uuidFrom(value.getId());

      if (peerId == value.getId() || peerUUID == valueUUID) {
        this.peerList.splice(index, 1);
      }
    });

    this.updateContent.onUpdate(this.peerList);
  }

  private onPeers(peers) {
    if (!this.connected) return;

    this.clearPeers();
    peers.forEach(peer => this.onPeerJoined(peer));
  }

  public clearPeers() {
    this.peerList = [];
    this.updateContent.onUpdate(this.peerList);
  }

  private onSignal(signal) {
    console.log(signal);

    const senderUUID = uuidFrom(signal.sender);

    this.peerList.forEach(value => {
      const valueUUID = uuidFrom(value.getId());

      if (value.getId() == signal.sender || valueUUID == senderUUID) {
        if (value.getPeer() === undefined || value.getPeer() === null) {
          value.setPeer(new RTCPeer(this.serverConnection, signal.sender));
        }


        if (value.getPeer() instanceof RTCPeer) {
          (value.getPeer() as RTCPeer).onServerMessage(signal);
        }

      }
    });
  }

}

export interface UpdateContent {
  onUpdate(peerList: Array<Host>): void;
}
