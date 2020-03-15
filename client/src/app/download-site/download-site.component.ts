import { Component, OnInit } from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import * as global from "../../environments/global";

@Component({
  selector: 'app-download-site',
  templateUrl: './download-site.component.html',
  styleUrls: ['./download-site.component.scss']
})
export class DownloadSiteComponent implements OnInit {

  globals: global.Globals;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.globals = new global.Globals(breakpointObserver);
  }

  ngOnInit(): void {
  }

}
