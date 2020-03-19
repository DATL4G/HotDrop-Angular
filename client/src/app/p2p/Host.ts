import {HostData} from "./HostData";
import {Discovery} from "./Discovery";
import {Peer} from "./Peer";
import {RTCPeer} from "./RTCPeer";
import {WSPeer} from "./WSPeer";

export class Host {
  private data: HostData
  private id: string;
  private ip: string;
  private rtcSupported: boolean;
  private discovery: Discovery;
  private peer: Peer;

  private readonly oppositeSupported: boolean;

  constructor(discovery: Discovery, supported: boolean) {
    this.discovery = discovery;
    this.oppositeSupported = supported;
  }

  public applyFromMessage(message): void {
      this.id = message.id;
      this.ip = message.ip;
      this.rtcSupported = message.rtcSupported;

      let dataModel;
      (message.data.model) ? dataModel = message.data.model : dataModel = null;

      this.data =  {
        browser: message.data.browser,
        model: dataModel,
        os: message.data.os,
        type: message.data.type
      }

      if (this.rtcSupported && this.oppositeSupported) {
        this.peer = new RTCPeer(this.discovery, this.id);
      } else {
        this.peer = new WSPeer(this.discovery, this.id);
      }
  }

  public setId(id: string): void {
    this.id = id;
  }

  public setIP(ip: string): void {
    this.ip = ip;
  }

  public getPeer(): Peer {
    return this.peer;
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

  public toServerData(): any {
    return {
      ip: this.ip,
      id: this.id
    };
  }

  public sendText(text: string): void {
    this.discovery.send('text', {
      to: this.id,
      msg: text
    });
  }

  public send(byteArray: ArrayBuffer): void {
    this.peer.send(byteArray);
  }
}
