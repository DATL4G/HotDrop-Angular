import {Peer} from "./Peer";
import {Discovery} from "./Discovery";

export class WSPeer extends Peer {

  constructor(serverConnection: Discovery, id: string) {
    super(serverConnection, id);
  }

  send(byteArray: ArrayBuffer) {
    this.serverConnection.send('file', {
      to: this.id,
      bytes: byteArray
    });
  }
}
