import {Component, OnInit} from '@angular/core';
import {GsapAnimationService} from "../animation/gsap-animation.service";
import {BreakpointObserver} from "@angular/cdk/layout";
import * as global from '../../environments/global';
import * as $ from 'jquery';
import {PeerDiscovery} from "../p2p/PeerDiscovery";
import {Host} from "../p2p/Host";

@Component({
  selector: 'app-main-site',
  templateUrl: './main-site.component.html',
  styleUrls: ['./main-site.component.scss']
})
export class MainSiteComponent implements OnInit {

  private searching: boolean = false;
  private peerDiscovery: PeerDiscovery;
  private peerList: Array<Host> = [];
  private peerColumn: Array<string> = [];
  public peerMapping: Array<{
    peer: Host,
    column: string
  }> = [];
  public globals: global.Globals;

  public col1ClassList = 'col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12';
  public col2ClassList = 'col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6';
  public col3ClassList = 'col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4';

  constructor(private breakpointObserver: BreakpointObserver, private gsapAnimationService: GsapAnimationService) {
    this.globals = new global.Globals(breakpointObserver);

    $('#hostContent').hide();
    let self = this;

    this.peerDiscovery = new PeerDiscovery({
      onUpdate(peerList: Array<Host>): void {
        self.peerList = peerList;
        self.updateHostContent();
        console.log(peerList);
      }
    })
  }

  ngOnInit() { }

  connect(): void {
    this.searching = !this.searching;

    if (this.searching) {
      this.peerDiscovery.connect();
      this.animateAllCircles();
    } else {
      this.stopAllCircles();
      this.peerDiscovery.disconnect();
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
    this.mapColumnClass();
  }

  private mapColumnClass(): void {
    this.peerColumn = [];
    this.peerMapping = [];

    if (this.peerList.length % 3 === 0) {
      this.peerList.forEach((value, index) => {
        this.peerColumn.push(this.col3ClassList);
      });
    } else if (this.peerList.length % 3 === 2) {
      this.peerList.forEach((value, index) => {
        if (index < this.peerList.length - 2) {
          this.peerColumn.push(this.col3ClassList);
        } else {
          this.peerColumn.push(this.col2ClassList);
        }
      });
    } else {
      this.peerList.forEach((value, index) => {
        if (index < this.peerList.length - 1) {
          this.peerColumn.push(this.col3ClassList);
        } else {
          this.peerColumn.push(this.col1ClassList);
        }
      })
    }

    for (let i = 0; i < this.peerList.length; i++) {
      this.peerMapping.push({
        peer: this.peerList[i],
        column: this.peerColumn[i]
      });
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
