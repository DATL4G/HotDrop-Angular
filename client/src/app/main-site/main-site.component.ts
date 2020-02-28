import {Component, Injector, OnInit} from '@angular/core';
import * as SocketIO from 'socket.io-client';
import * as P2P from 'socket.io-p2p';
import {PeerData} from "../p2p/PeerData";
import {GsapAnimationService} from "../animation/gsap-animation.service";
import {Observable} from "rxjs";
import {Breakpoints, BreakpointObserver} from "@angular/cdk/layout";
import {map, shareReplay} from "rxjs/operators";
import {DiscoveryPeerData} from "../p2p/DiscoveryPeerData";
import * as $ from 'jquery';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-main-site',
  templateUrl: './main-site.component.html',
  styleUrls: ['./main-site.component.scss']
})
export class MainSiteComponent implements OnInit {

  private socket = SocketIO(environment.serverUri+3241);
  private opts = { peerOpts: { trickle: false }, autoUpgrade: false, numClients: 20 };
  private p2pSocket = new P2P(this.socket, this.opts);

  private ioPeerDataRequest = 'peer-data-request';
  private ioPeerDataResponse = 'peer-data-response';
  private ioPeerDataUpdate = 'peer-data-update';
  private ioPeerListChanged = 'peer-list-changed';
  private ioPeerListRequest = 'peer-list-request';
  private ioPeerListResponse = 'peer-list-response';


  private jsonPeerData: {
    searching: boolean,
    name: string,
    type: number,
    address?: string
  } = null;
  public peerList: Array<DiscoveryPeerData> = [];
  private searching: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private peerData: PeerData, private gsapAnimationService: GsapAnimationService) {
    this.p2pSocket.on(this.ioPeerDataRequest, () => {
      this.p2pSocket.emit(this.ioPeerDataResponse, this.jsonPeerData);
    });
  }

  ngOnInit() { }

  connect(): void {
    this.searching = !this.searching;
    this.updatePeerData(this.searching);

    if (this.searching) {
      this.attachDiscoveryListener();
      this.p2pSocket.emit(this.ioPeerListRequest, null);
      this.animateAllCircles();
    } else {
      this.stopAllCircles();
      this.detachDiscoveryListener();
    }
  }

  updatePeerData(searching: boolean) {
    this.jsonPeerData = {
      searching: searching,
      name: this.peerData.getName(),
      type: this.peerData.getType(),
      address: this.peerData.getAddress()
    };

    this.p2pSocket.emit(this.ioPeerDataUpdate, this.jsonPeerData);
  }

  attachDiscoveryListener() {
    this.p2pSocket.on(this.ioPeerListResponse, (responseData) => {
      this.peerList = this.filterDiscoveryResponse(responseData);
      if(this.peerList.length > 0) {
        $('#searchFAB').hide();
      } else {
        $('#searchFAB').show();
      }
      console.clear();
      console.log(this.peerList);
    });

    this.p2pSocket.on(this.ioPeerListChanged, () => {
      this.p2pSocket.emit(this.ioPeerListRequest, null);
    });
  }

  detachDiscoveryListener() {
    this.peerList = [];
    this.p2pSocket.on(this.ioPeerListResponse, () => {});
    this.p2pSocket.on(this.ioPeerListChanged, () => {});
  }

  filterDiscoveryResponse(responseData): Array<DiscoveryPeerData> {
    const responseCopy: Array<DiscoveryPeerData> = Object.assign([], responseData);
    responseCopy.forEach((value, index) => {
      if(!value.data.searching || value.peerId === this.p2pSocket['peerId']) {
        responseCopy.splice(index, 1);
      }
    });

    return this.squash(responseCopy);
  }

  private squash(arr) {
    let tmp = [];
    for(let i = 0; i < arr.length; i++){
      if(tmp.indexOf(arr[i]) == -1){
        tmp.push(arr[i]);
      }
    }
    return tmp;
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
