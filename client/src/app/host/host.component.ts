import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Breakpoints, BreakpointObserver} from "@angular/cdk/layout";
import {map, shareReplay} from "rxjs/operators";
import {Host} from "../p2p/Host";
const str2ab = require('string-to-arraybuffer')

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  @Input() peerData: Host
  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void { }

  public sendData(): void {
    this.peerData.getPeer().send(str2ab('Hello from the other side'));
  }

  public getHostName(): string {
    if (this.peerData.getData().model !== null
      && this.peerData.getData().model !== undefined) {
      return  this.peerData.getData().model;
    } else {
      return  this.peerData.getData().os +'-'+ this.peerData.getData().browser;
    }
  }

  public getMatIconName(): string {
    switch (this.peerData.getData().type) {
      case 0:
        return 'watch';
      case 1:
        return 'phone_android';
      case 2:
        return 'smartphone';
      case 3:
        return 'tablet_android';
      case 4:
        return 'tv';
    }
  }
}
