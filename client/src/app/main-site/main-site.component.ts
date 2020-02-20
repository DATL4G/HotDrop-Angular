import {Component, Injector, OnInit} from '@angular/core';
import * as SocketIO from 'socket.io-client';
import * as P2P from 'socket.io-p2p';
import {PeerData} from "../p2p/PeerData";
import {GsapAnimationService} from "../animation/gsap-animation.service";
import {Observable} from "rxjs";
import {Breakpoints, BreakpointObserver} from "@angular/cdk/layout";
import {map, shareReplay} from "rxjs/operators";

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
  private peerList: Array<{}>;
  private searching: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, peerData: PeerData, private gsapAnimationService: GsapAnimationService) {
    this.jsonPeerData = peerData.get();
  }

  ngOnInit() { }

  connect(): void {
    this.p2pSocket.on('peer-msg', function (data) {
      console.log(data);
    });

    if (!this.searching) {
      this.pingPeers();
      this.animateAllCircles();
    } else {
      this.stopAllCircles();
    }

    this.searching = !this.searching;
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

  private animateAllCircles() {
    for (let i = 1; i <= 20; i++) {
      this.animateCircle(i);
    }
  }

  private stopAllCircles() {
    for (let i = 1; i <= 20; i++) {
      const circleId = '#circle' + i;
      this.gsapAnimationService.stopFor(circleId);
    }
  }

  private animateCircle(circleNum: number): void {
    const circleId = '#circle' + circleNum;
    const circleDefaultRadius = 65 + (circleNum-1)*150;
    const circleNewRadius = 215 + (circleNum-1)*150;
    this.gsapAnimationService.transformFromTo(circleId, circleDefaultRadius, circleNewRadius);
  }

}
