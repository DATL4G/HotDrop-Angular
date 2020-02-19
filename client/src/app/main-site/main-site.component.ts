import {Component, Injector, OnInit} from '@angular/core';
import * as SocketIO from 'socket.io-client';
import * as P2P from 'socket.io-p2p';
import {Peer} from "../p2p/Peer";
import {PeerData} from "../p2p/PeerData";

@Component({
  selector: 'app-main-site',
  templateUrl: './main-site.component.html',
  styleUrls: ['./main-site.component.scss']
})
export class MainSiteComponent implements OnInit {

  private socket = SocketIO('http://localhost:3241/');
  private opts = { peerOpts: { trickle: false }, autoUpgrade: false, numClients: 20 };
  private p2pSocket = new P2P(this.socket, this.opts);
  private ioPingPeers = 'ping-peers';
  private jsonPeerData: {};

  constructor(peerData: PeerData) {
    this.jsonPeerData = peerData.get();
  }

  ngOnInit() {
  }

  connect(): void {
    this.p2pSocket.on('peer-msg', function (data) {
      console.log(data);
    });

    this.pingPeers();
  }

  enableWebRTC(): void {
    const ioEnableWebRTC = 'enable-webrtc';

    this.p2pSocket.on(ioEnableWebRTC, () => {
      this.p2pSocket.useSockets = false;
    });
    this.p2pSocket.emit(ioEnableWebRTC, true);
  }

  pingPeers(): void {
    this.sendPeerData(true);

    this.p2pSocket.on(this.ioPingPeers, (data) => {
      if (data.requestPeers) {
        this.sendPeerData(false);
      }
      console.log(data);
    });
  }


  sendPeerData(requestEnabled: boolean = false): void {
    this.p2pSocket.emit(this.ioPingPeers, {
      peerData: this.jsonPeerData,
      requestPeers: requestEnabled
    });
  }

}
