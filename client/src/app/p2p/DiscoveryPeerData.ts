export class DiscoveryPeerData {
  public peerListId: number;
  public peerId: string;
  public data: {
    searching: boolean,
    name: string,
    type: number,
    address?: string
  }
}
