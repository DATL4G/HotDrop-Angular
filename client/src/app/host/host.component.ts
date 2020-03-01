import {Component, Input, OnInit} from '@angular/core';
import {DiscoveryPeerData} from "../p2p/DiscoveryPeerData";
import {Observable} from "rxjs";
import {Breakpoints, BreakpointObserver} from "@angular/cdk/layout";
import {map, shareReplay} from "rxjs/operators";

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

  @Input() peerData: DiscoveryPeerData
  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
  }

  public getMatIconName(): string {
    switch (this.peerData.data.type) {
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
