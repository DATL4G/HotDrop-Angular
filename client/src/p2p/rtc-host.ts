import { Host } from "./host";
import { ServerConnection } from "./index";

class RTCHost extends Host {

  private connection: RTCPeerConnection;
  private isCaller: boolean;
  private channel: RTCDataChannel;

  constructor(serverConnection: ServerConnection, hostId) {
    super(serverConnection, hostId);
    if (!hostId) return;
    this.connect(hostId, true);
  }

  connect(hostId, isCaller) {
    if (!this.connection) this.openConnection(hostId, isCaller);

    if (isCaller) this.openChannel();
    else this.connection.ondatachannel = e => this.onChannelOpened(e);
  }

  openConnection(hostId, isCaller) {
    if (!this.connection) this.openConnection(hostId, isCaller);

    if (isCaller) this.openChannel();
    else this.connection.ondatachannel = e => this.onChannelOpened(e);
  }

  openChannel() {
    const openChannel = this.connection.createDataChannel('data-channel');
    openChannel.binaryType = 'arraybuffer';
    openChannel.onopen = e => this.onChannelOpened(e);
    this.connection.createOffer()
      .then(d => this.onDescription(d))
      .catch(e => this.onError(e));
  }

  onDescription(description) {
    this.connection.setLocalDescription(description)
      .then(_ => this.sendSignal({ sdp: description}))
      .catch(e => this.onError(e));
  }

  onIceCandidate(event) {
    if (!event.candidate) return;
    this.sendSignal({ ice: event.candidate });
  }

  onServerMessage(message) {
    if (!this.connection) this.connect(message.sender, false);
    if (message.sdp) {
      this.connection.setRemoteDescription(new RTCSessionDescription(message.sdp))
        .then( _ => {
          if (message.sdp.type === 'offer') {
            return this.connection.createAnswer()
              .then(d => this.onDescription(d));
          }
        })
        .catch(e => this.onError(e))
    } else if (message.ice) {
      this.connection.addIceCandidate(new RTCIceCandidate(message.ice));
    }
  }

  onChannelOpened(event) {
    console.log('RTC: channel opened with', this.hostId);
    const openChannel = event.channel || event.target;
    openChannel.onmessage = e => this.onMessage(e.data);
    openChannel.onclose = e => this.onChannelClosed();
    this.channel = openChannel;
  }

  onChannelClosed() {
    console.log('RTC: channel closed', this.hostId);
    if (!this.isCaller) return;
    this.connect(this.hostId, true);
  }

  onConnectionStateChanged() {
    console.log('RTC: state changed:', this.connection.connectionState);
    switch (this.connection.connectionState) {
      case "disconnected":
        this.onChannelClosed();
        break;
      case "failed":
        this.connection = null;
        this.onChannelClosed();
        break;
    }
  }

  onIceConnectionStateChange() {
    switch (this.connection.iceConnectionState) {
      case "failed":
        this.onError('Ice Gathering failed');
        break;
      default:
        console.log('Ice Gathering', this.connection.iceConnectionState);
    }
  }

  onError(error) {
    console.error(error);
  }

  send(message) {
    if (!this.channel) return this.refresh();
    this.channel.send(message);
  }

  sendSignal(signal) {
    signal.type = 'signal';
    signal.to = this.hostId;
    this.server.send(signal);
  }

  refresh() {
    if (this.isConnected() || this.isConnecting()) return;
    this.connect(this.hostId, this.isCaller);
  }

  isConnected(): boolean {
    return this.channel && this.channel.readyState === 'open';
  }

  isConnecting(): boolean {
    return this.channel && this.channel.readyState === 'connecting';
  }

}
