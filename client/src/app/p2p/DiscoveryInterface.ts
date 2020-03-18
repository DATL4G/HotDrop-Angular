import {Host} from "./Host";

export interface DiscoveryInterface {
  onConnected(): void
  onDisconnected(wasConnected: boolean): void
  onHostUpdate(peerList: Array<Host>): void
}
