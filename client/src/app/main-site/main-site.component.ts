import {Component, Injector, OnInit} from '@angular/core';
import * as SocketIO from 'socket.io-client';
import * as P2P from 'socket.io-p2p';

@Component({
  selector: 'app-main-site',
  templateUrl: './main-site.component.html',
  styleUrls: ['./main-site.component.scss']
})
export class MainSiteComponent implements OnInit {

  private socket = SocketIO('http://localhost:3241');
  private opts = { peerOpts: { trickle: false }, autoUpgrade: false };
  private p2pSocket = new P2P(this.socket, this.opts, () => this.newObject());

  constructor() { }

  ngOnInit() {
  }

  newObject() {
    this.p2pSocket.emit('peer-obj', 'Hello there. I am Jeff');
  }

  connect(): void {

    this.p2pSocket.on('peer-msg', function (data) {
      console.log(data);
    });

    this.p2pSocket.on('go-private', (data) => this.goPrivate(data))
  }

  goPrivate(data): void {
    this.p2pSocket.useSockets = false;
    console.log('WebRTC connection established');
  }

}
