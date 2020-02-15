import {ServerConnection} from "./index";

export class Host {

  protected server: ServerConnection;
  protected hostId;
  private filesQueue = [];
  private busy: boolean = false;

  constructor(serverConnection, hostId) {
    this.server = serverConnection;
    this.hostId = hostId;
  }

  sendJSON(message): void {

  }

  sendFiles(files): void {

  }

  dequeueFile(): void {

  }

  sendFile(file): void {

  }

  onPartitionEnd(offset): void {

  }

  onReceivedPartitionEnd(offset): void {

  }

  sendNextPartition(): void {

  }

  sendProgress(progress): void {

  }

  onMessage(message): void {

  }

  onFileHeader(header): void {

  }

  onChunkReceived(chunk): void {

  }

  onDownloadProgress(progress): void {

  }

  onFileReceived(proxyFile): void {

  }

  onTransferCompleted(): void {

  }

  sendText(text): void {

  }

  onTextReceived(message): void {

  }
}
