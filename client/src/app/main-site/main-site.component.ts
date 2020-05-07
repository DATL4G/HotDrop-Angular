import {Component, OnInit} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {GsapAnimationService} from "../animation/gsap-animation.service";
import {BreakpointObserver} from "@angular/cdk/layout";
import * as global from '../../environments/global';
import * as $ from 'jquery';
import {Host} from "../p2p/Host";
import {Discovery} from "../p2p/Discovery";
import {SocketConnectSnackbar} from "../snackbars/socket-connect/socket-connect-snackbar";
import {IpcService} from "../ipc-service/ipc.service";

@Component({
  selector: 'app-main-site',
  templateUrl: './main-site.component.html',
  styleUrls: ['./main-site.component.scss']
})
export class MainSiteComponent implements OnInit {

  private searching: boolean = false;
  private peerList: Array<Host> = [];
  private peerColumn: Array<number> = [];
  public peerMapping: Array<{
    peer: Host,
    column: number
  }> = [];
  public globals: global.Globals;
  public discovery: Discovery;


  constructor(private breakpointObserver: BreakpointObserver,
              private gsapAnimationService: GsapAnimationService,
              public snackbar: MatSnackBar, private readonly ipc: IpcService) {
    this.globals = new global.Globals(breakpointObserver);

    let self = this;
    this.discovery = new Discovery(ipc, {
      onConnected(): void {
        const snackBarRef = snackbar.openFromComponent(SocketConnectSnackbar, {
          duration: 5000,
          data: "Connected",
          panelClass: ['snackbar-default']
        });
      },

      onDisconnected(wasConnected: boolean): void {
        if (wasConnected) {
          self.stopAllCircles();
          const snackBarRef = snackbar.openFromComponent(SocketConnectSnackbar, {
            duration: 5000,
            data: "Disconnected",
            panelClass: ['snackbar-default']
          });
        }
      },

      onHostUpdate(peerList: Array<Host>): void {
        self.peerList = peerList;
        self.updateHostContent();
      }
    });

    $('#hostContent').hide();
  }

  ngOnInit() { }

  connect(): void {
    this.searching = !this.searching;

    if (this.searching) {
      this.discovery.connect();
      this.animateAllCircles();
    } else {
      this.stopAllCircles();
      this.discovery.disconnect();
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

    if (this.peerList.length === 3) {
      this.peerColumn.push(3);
      this.peerColumn.push(3);
      this.peerColumn.push(6);
    } else if (this.peerList.length === 4) {
      this.peerColumn.push(3);
      this.peerColumn.push(3);
      this.peerColumn.push(3);
      this.peerColumn.push(3);
    } else {
      if (this.peerList.length % 3 === 0) {
        this.peerList.forEach((value, index) => {
          this.peerColumn.push(2);
        });
      } else if (this.peerList.length % 3 === 2) {
        this.peerList.forEach((value, index) => {
          if (index < this.peerList.length - 2) {
            this.peerColumn.push(2);
          } else {
            this.peerColumn.push(3);
          }
        });
      } else {
        this.peerList.forEach((value, index) => {
          if (index < this.peerList.length - 1) {
            this.peerColumn.push(2);
          } else {
            this.peerColumn.push(6);
          }
        })
      }
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
