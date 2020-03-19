import {Discovery} from "./Discovery";

export abstract class Peer {

  protected serverConnection: Discovery;
  protected id: string;

  protected constructor(serverConnection, id) {
    this.serverConnection = serverConnection;
    this.id = id;
  }

  onMessage(data): void {
    console.log(data);
  }

  abstract send(byteArray: ArrayBuffer);
}
