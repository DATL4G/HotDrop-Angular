import {Peer} from "./Peer";
import {environment} from "../../environments/environment";
const ab2str = require('arraybuffer-to-string');

export class RTCPeer extends Peer {

  private isCaller: boolean = false;
  private conn: RTCPeerConnection;
  private channel;
  private readonly config;

  constructor(serverConnection, peerId) {
    super(serverConnection, peerId);
    if (!peerId) return;
    this.config = environment.rtcConfig;
    this.connect(peerId, true);
  }

  connect(peerId, isCaller) {
    if (!this.conn) this.openConnection(peerId, isCaller);

    if (isCaller) {
      this.openChannel();
    } else {
      this.conn.ondatachannel = e => this.onChannelOpened(e);
    }
  }

  openConnection(peerId, isCaller) {
    this.isCaller = isCaller;
    this.peerId = peerId;
    this.conn = new RTCPeerConnection(this.config);
    this.conn.onicecandidate = e => this.onIceCandidate(e);
    this.conn.onconnectionstatechange = e => this.onConnectionStateChange(e);
    this.conn.oniceconnectionstatechange = e => this.onIceConnectionStateChange(e);
  }

  openChannel() {
    console.log('channel opening');
    const channel: RTCDataChannel = this.conn.createDataChannel('data-channel');
    channel.binaryType = 'arraybuffer';
    channel.onopen = e => this.onChannelOpened(e);
    this.conn.createOffer().then(d => this.onLocalDescription(d)).catch(e => this.onError(e));
  }

  onLocalDescription(description) {
    this.conn.setLocalDescription(description)
      .then(_ => this.sendSignal({ sdp: description }))
      .catch(e => {
        this.onError(e);
      });
  }

  onIceCandidate(event) {
    if (!event.candidate) return;
    this.sendSignal({ ice: event.candidate });
  }

  onServerMessage(message) {
    console.log('server message: ');
    console.log(message);
    if (!this.conn) this.connect(message.sender, false);

    if (message.sdp) {
      this.conn.setRemoteDescription(new RTCSessionDescription(message.sdp))
        .then( _ => {
          if (message.sdp.type === 'offer') {
            return this.conn.createAnswer()
              .then(d => this.onLocalDescription(d));
          }
        })
        .catch(e => console.error(e));
    } else if (message.ice) {
      this.conn.addIceCandidate(new RTCIceCandidate(message.ice));
    }
  }

  onChannelOpened(event) {
    console.log('RTC: channel opened with', this.peerId);
    const channel = event.channel || event.target;
    channel.onmessage = e => this.onMessage(e.data);
    channel.onclose = e => this.onChannelClosed();
    this.channel = channel;
  }

  onChannelClosed() {
    console.log('RTC: channel closed', this.peerId);
    if (!this.isCaller) return;
    this.connect(this.peerId, true);
  }

  onConnectionStateChange(e) {
    console.log('state change');
    console.warn(e);

    console.log('RTC: state changed:', this.conn.connectionState);
    switch (this.conn.connectionState) {
      case 'disconnected':
        this.onChannelClosed();
        break;
      case 'failed':
        this.conn = null;
        this.onChannelClosed();
        break;
    }
  }

  onIceConnectionStateChange(e) {
    console.log('connection change');
    console.warn(e);

    switch (this.conn.iceConnectionState) {
      case 'failed':
        console.error('ICE Gathering failed');
        break;
      default:
        console.log('ICE Gathering', this.conn.iceConnectionState);
    }
  }

  onError(error) {
    console.error(error);
  }

  send(message) {
    console.log('sending: ' + message);
    if (!this.channel) return this.refresh();
    this.channel.send(message);
    console.log('sent');
  }

  sendSignal(signal) {
    signal.type = 'signal';
    signal.to = this.peerId;
    this.server.send(signal);
  }

  refresh() {
    if (this.isConnected() || this.isConnecting()) return;
    this.connect(this.peerId, this.isCaller);
  }

  isConnected() {
    return this.channel && this.channel.readyState === 'open';
  }

  isConnecting() {
    return this.channel && this.channel.readyState === 'connecting';
  }
}
