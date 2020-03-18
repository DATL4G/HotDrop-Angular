import { Component } from '@angular/core';
import { BreakpointObserver } from "@angular/cdk/layout";
import * as global from '../environments/global';
import {Globals} from "../environments/global";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HotDrop';

  public globals: global.Globals;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.globals = new Globals(breakpointObserver);
  }

}
