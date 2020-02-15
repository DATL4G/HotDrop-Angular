import {ServerConnection} from "./index";

class WSHost {

  private server: ServerConnection;
  private readonly hostId;

  constructor(serverConnection: ServerConnection, hostId) {
    this.hostId = hostId;
    this.server = serverConnection;
  }

  public send(message): void {
    message.to = this.hostId;
    this.server.send(message);
  }
}
