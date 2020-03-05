import {Peer} from "./Peer";

export class WSPeer extends Peer {

  constructor(server, peerId) {
    super(server, peerId);
  }

  send(message): void {
    message.to = this.peerId;
    this.server.send(message);
  }
}
