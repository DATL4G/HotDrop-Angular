import {Component, OnInit} from '@angular/core';
import {GsapAnimationService} from "../animation/gsap-animation.service";
import {Observable} from "rxjs";
import {Breakpoints, BreakpointObserver} from "@angular/cdk/layout";
import {map, shareReplay} from "rxjs/operators";
import * as $ from 'jquery';
import {ServerConnection} from "../p2p/ServerConnection";
import {Events} from "../p2p/Events";
import {Host} from "../p2p/Host";
import { fromString } from 'uuidv4';
import * as DetectRTC from 'detectrtc';
import {RTCPeer} from "../p2p/RTCPeer";
import {WSPeer} from "../p2p/WSPeer";

@Component({
  selector: 'app-main-site',
  templateUrl: './main-site.component.html',
  styleUrls: ['./main-site.component.scss']
})
export class MainSiteComponent implements OnInit {

  private searching: boolean = false;
  private serverConnection = new ServerConnection();
  public peerList: Array<Host> = [];
  private rtcSupported = DetectRTC.isWebRTCSupported;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  public col1ClassList = 'col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12';
  public col2ClassList = 'col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6';
  public col3ClassList = 'col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4';

  constructor(private breakpointObserver: BreakpointObserver, private gsapAnimationService: GsapAnimationService) {
    $('#hostContent').hide();

    Events.on('peer-joined', e => this.onPeerJoined(e.detail));
    Events.on('peer-left', e => this.onPeerLeft(e.detail));
    Events.on('peers', e => this.onPeers(e.detail));
    Events.on('signal', e => this.onSignal(e.detail));
  }

  ngOnInit() { }

  connect(): void {
    this.searching = !this.searching;

    if (this.searching) {
      this.attachDiscovery();
      this.animateAllCircles();
    } else {
      this.stopAllCircles();
      this.detachDiscovery();
    }
  }

  attachDiscovery(): void {
    this.serverConnection.connect();
  }

  detachDiscovery(): void {
    this.serverConnection.disconnect();
    this.serverConnection.onDisconnect();
    this.clearPeers();
  }

  onPeerJoined(peer): void {
    const peerUUID = fromString(peer.id);

    this.peerList.forEach((value) => {
      const valueUUID = fromString(value.getId());

      if (peer.id == value.getId() || peerUUID == valueUUID) {
        return;
      }
    });

    const host = new Host();
    host.applyFromMessage(peer);
    if (this.rtcSupported && peer.rtcSupported) {
      host.setPeer(new RTCPeer(this.serverConnection, host.getId()));
    } else {
      host.setPeer(new WSPeer(this.serverConnection, host.getId()));
    }

    this.peerList.push(host);

    this.updateHostContent();
  }

  onPeerLeft(peerId): void {
    const peerUUID = fromString(peerId);

    this.peerList.forEach((value, index) => {
      const valueUUID = fromString(value.getId());

      if (peerId == value.getId() || peerUUID == valueUUID) {
        this.peerList.splice(index, 1);
      }
    });

    this.updateHostContent();
  }

  onPeers(peers) {
    this.clearPeers();
    peers.forEach(peer => this.onPeerJoined(peer));
  }

  clearPeers() {
    this.peerList = [];
    this.updateHostContent();
  }

  onSignal(signal) {
    const senderUUID = fromString(signal.sender);
    let host: Host = null;

    this.peerList.forEach(value => {
      const valueUUID = fromString(value.getId());

      if (value.getId() == signal.sender || senderUUID == valueUUID) {
        host = value;
      }
    });

    if (host !== null) {
      if (host.getPeer() === null || host.getPeer() === undefined) {
        host.setPeer(new RTCPeer(this.serverConnection, signal.sender));
      }

      if (typeof host.getPeer() === typeof RTCPeer) {
        (host.getPeer() as RTCPeer).onServerMessage(signal);
      }
    }
  }

  private updateHostContent(): void {
    if (this.peerList.length > 0) {
      $('#hostContent').show();
      $('#searchFAB').hide();
    } else {
      $('#hostContent').hide();
      $('#searchFAB').show();
    }
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
