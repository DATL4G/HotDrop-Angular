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

  private socket = SocketIO(environment.serverUri+3241, { forceNew: true, reconnection: false });
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

  public col1ClassList = 'col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12';
  public col2ClassList = 'col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6';
  public col3ClassList = 'col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4';

  constructor(private breakpointObserver: BreakpointObserver, private peerData: PeerData, private gsapAnimationService: GsapAnimationService) {
    $('#hostContent').hide();
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
        $('#hostContent').show();
        $('#searchFAB').hide();
      } else {
        $('#searchFAB').show();
        $('#hostContent').hide();
      }
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
    const responseCopy: Array<DiscoveryPeerData> = Object.assign([], this.squash(responseData));
    const removeDuplicates: Array<DiscoveryPeerData> = [];

    responseCopy.forEach((value, index) => {
      let addToDuplicates: boolean = true;

      if(!value.data.searching || value.peerId === this.p2pSocket['peerId']) {
        responseCopy.splice(index, 1);
      }

      removeDuplicates.forEach(duplicates => {
        if(value.peerId === duplicates.peerId && addToDuplicates) {
          addToDuplicates = false;
        }
      });

      if (addToDuplicates) {
        removeDuplicates.push(value);
      }
    });

    return removeDuplicates;
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
