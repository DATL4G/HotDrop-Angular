import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Breakpoints, BreakpointObserver} from "@angular/cdk/layout";
import {map, shareReplay} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import * as global from "../../environments/global";
import {DependenciesDialog} from "../dialogs/dependencies/dependencies-dialog";
import {AboutDialog} from "../dialogs/about/about-dialog";

@Component({
  selector: 'app-info-layout',
  templateUrl: './info-layout.component.html',
  styleUrls: ['./info-layout.component.scss']
})
export class InfoLayoutComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
              public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openRepo(): void {
    let win = window.open('https://github.com/DATL4G/HotDrop-Angular', '_blank');
    win.focus();
  }

  openDep(): void {
    const dialogRef = this.dialog.open(DependenciesDialog, {
      width: global.dialogWidth,
      data: global.dependencies
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== null) {
        let win = window.open(global.dependencyLinks[result], '_blank');
        win.focus();
      }
    });
  }

  openInfo(): void {
    const dialogRef = this.dialog.open(AboutDialog);
  }

}
