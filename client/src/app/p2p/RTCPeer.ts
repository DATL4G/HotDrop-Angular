import {Peer} from "./Peer";
import {Discovery} from "./Discovery";
import {environment} from "../../environments/environment";

export class RTCPeer extends Peer {

  private connection: RTCPeerConnection;
  private isCaller: boolean;
  private channel: RTCDataChannel;

  constructor(serverConnection: Discovery, id: string) {
    super(serverConnection, id);
    this.connect(this.id, true);
  }

  private connect(id: string, isCaller: boolean): void {
    if (!this.connection) this.openConnection(id, isCaller);

    if (isCaller) {
      this.openChannel();
    } else {
      this.connection.ondatachannel = e => this.onChannelOpened(e);
    }
  }

  private openConnection(id: string, isCaller: boolean): void {
    this.isCaller = isCaller;
    this.id = id;
    this.connection = new RTCPeerConnection(environment.rtcConfig);
    this.connection.onicecandidate = e => this.onIceCandidate(e);
    this.connection.onconnectionstatechange = e => this.onConnectionStateChanged();
    this.connection.oniceconnectionstatechange = e => this.onIceConnectionStateChanged();
  }

  private openChannel() {
    const channel = this.connection.createDataChannel('data-channel');
    channel.binaryType = 'arraybuffer';
    channel.onopen = e => this.onChannelOpened(e);
    this.connection.createOffer().then(d => this.onDescription(d)).catch(e => console.error(e));
  }

  private onChannelOpened(event): void {
    console.log('RTC channel opened with ', this.id);

    const channel = event.channel || event.target;
    channel.onmessage = e => this.onMessage(e.data);
    channel.onclose = e => this.onChannelClosed();
    this.channel = channel;
  }

  private onChannelClosed(): void {
    console.log('RTC channel closed: ', this.id);
    if (!this.isCaller) return;
    this.connect(this.id, true);
  }

  private onIceCandidate(event: RTCPeerConnectionIceEvent): void {
    if (!event.candidate) return;

    this.sendSignal({ ice: event.candidate });
  }

  private onConnectionStateChanged(): void {
    console.log('RTC state changed: ', this.connection.connectionState);

    switch (this.connection.connectionState) {
      case "disconnected":
        this.onChannelClosed();
        break;
      case "failed":
        this.onChannelClosed();
        this.connection = null;
        break;
    }
  }

  private onIceConnectionStateChanged(): void {
    switch (this.connection.connectionState) {
      case "failed":
        console.error('ICE Gathering failed');
        break;
      default:
        console.log('ICE Gathering: ', this.connection.iceConnectionState);
    }
  }

  public onServerMessage(message) {
    if (!this.connection) this.connect(message.from, false);

    if (message.sdp) {
      this.connection.setRemoteDescription(new RTCSessionDescription(message.sdp))
        .then(_ => {
          if (message.sdp.type === 'offer') {
            return this.connection.createAnswer().then(d => this.onDescription(d));
          }
        })
        .catch(e => console.error(e));
    } else if (message.ice) {
      this.connection.addIceCandidate(new RTCIceCandidate(message.ice));
    }
  }

  private onDescription(description): void {
    this.connection.setLocalDescription(description)
      .then(_ => this.sendSignal({ sdp: description }))
      .catch(e => console.error(e));
  }

  private sendSignal(signal): void {
    signal.to = this.id;
    this.serverConnection.send('signal', signal);
  }

  private refresh(): void {
    if (this.isConnecting() || this.isConnected()) return;
    this.connect(this.id, this.isCaller);
  }

  private isConnected(): boolean {
    return this.channel && this.channel.readyState === 'open';
  }

  private isConnecting(): boolean {
    return this.channel && this.channel.readyState === 'connecting';
  }

  send(byteArray: ArrayBuffer) {
    if (!this.channel) return this.refresh();

    this.channel.send(JSON.stringify({
      bytes: byteArray,
      to: this.id
    }));
  }
}
