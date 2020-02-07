import { v4 as UUID } from 'uuid';

export class Host {

  public socket;
  public ip;
  public name;
  public id;
  public rtcSupported;
  public timerId;
  public lastBeat;

  public static getUUID(): string {
    return UUID();
  }

  constructor(socket, request) {
    this.socket = socket;
    this.setIP(request);
    this.setId(request);
    this.rtcSupported = request.url.indexOf('webrtc') > -1;
    this.setName(request);
    this.timerId = 0;
    this.lastBeat = Date.now();
  }

  private setIP(request) {
    if (request.headers['x-forward-for']) {
      this.ip = request.headers['x-forward-for'].split(/\s*,\s*/)[0];
    } else {
      this.ip = request.connection.remoteAddress;
    }

    this.checkLoopbackAddress();
  }

  private checkLoopbackAddress() {
    if (this.ip === '::1' || this.ip === '::ffff:127.0.0.1') {
      this.ip = '127.0.0.1';
    }
  }

  private setId(request) {
    if (request.hostId) {
      this.id = request.hostId;
    } else {
      this.id = request.headers.cookie.replace('hostid=', '');
    }
  }

  public toString() {
    return `<Peer id=${this.id} ip=${this.ip} rtcSupported=${this.rtcSupported}>`;
  }

  private setName(request) {
    // const ua = parser(request.headers['user-agent']);
    this.name = {
      model: 'linux-datlag',
      os: 'Linux',
      browser: 'Opera',
      type: 'PC'
    };
  }

  public getInfo() {
    return {
      id: this.id,
      name: this.name,
      rtcSupported: this.rtcSupported
    };
  }

}
