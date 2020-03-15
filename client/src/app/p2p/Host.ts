import {HostData} from "./HostData";
import {Peer} from "./Peer";

export class Host {
  private data: HostData
  private id: string;
  private peer: Peer;

  public applyFromMessage(message, dataIsRoot: boolean = false): void {
    if (dataIsRoot) {
      let dataModel;
      (message.model) ? dataModel = message.model : dataModel = null;

      this.data =  {
        browser: message.browser,
        ip: message.ip,
        model: dataModel,
        os: message.os,
        type: message.type
      }
    } else {
      this.id = message.id;

      let dataModel;
      (message.data.model) ? dataModel = message.data.model : dataModel = null;

      this.data =  {
        browser: message.data.browser,
        ip: message.data.ip,
        model: dataModel,
        os: message.data.os,
        type: message.data.type
      }
    }
  }

  public setId(id: string): void {
    this.id = id;
  }

  public setData(data: HostData): void {
    this.data = data;
  }

  public getId(): string {
    return this.id;
  }

  public getData(): HostData {
    return this.data;
  }

  public setPeer(peer: Peer) {
    this.peer = peer;
  }

  public getPeer(): Peer {
    return this.peer;
  }

  public send(byteArray: ArrayBuffer): void {
    this.peer.send(byteArray);
  }
}
