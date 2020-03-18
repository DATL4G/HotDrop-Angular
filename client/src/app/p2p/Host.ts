import {HostData} from "./HostData";
import {Discovery} from "./Discovery";

export class Host {
  private data: HostData
  private id: string;
  private ip: string;

  public applyFromMessage(message): void {
      this.id = message.id;
      this.ip = message.ip;

      let dataModel;
      (message.data.model) ? dataModel = message.data.model : dataModel = null;

      this.data =  {
        browser: message.data.browser,
        model: dataModel,
        os: message.data.os,
        type: message.data.type
      }
  }

  public setId(id: string): void {
    this.id = id;
  }

  public setIP(ip: string): void {
    this.ip = ip;
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

  public send(byteArray: ArrayBuffer, discovery: Discovery): void {
    discovery.privateConnection(this.toServerData());
    console.log({
      data: byteArray,
      ip: this.ip,
      id: this.id
    });
    setTimeout(() => discovery.send('peer-message', {
      data: byteArray,
      ip: this.ip,
      id: this.id
    }), 5000);
  }
}
