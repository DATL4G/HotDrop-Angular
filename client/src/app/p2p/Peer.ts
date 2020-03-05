 const ab2str = require('arraybuffer-to-string')

export abstract class Peer {

  protected server;
  protected peerId;

  abstract send(chunk: Uint8Array);

  protected constructor(serverConnection, peerId) {
    this.server = serverConnection;
    this.peerId = peerId;
  }

  onMessage(data) {
    console.log('Data: ' + data);
    console.log(ab2str(data));
  }

}
