import {Component, Input, OnInit} from '@angular/core';
import {Host} from "../p2p/Host";
import {Discovery} from "../p2p/Discovery";
const str2ab = require('string-to-arraybuffer')

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent implements OnInit {

  @Input() peerData: Host;
  @Input() discovery: Discovery;
  constructor() { }

  ngOnInit(): void { }

  public sendData(): void {
    console.log('sending data');
    this.peerData.send(str2ab('Test'), this.discovery);
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
