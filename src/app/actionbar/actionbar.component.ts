import { Component, Inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, from } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import * as $ from 'jquery';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingsDialog } from '../dialogs/settings/settings-dialog';

@Component({
  selector: 'app-actionbar',
  templateUrl: './actionbar.component.html',
  styleUrls: ['./actionbar.component.scss']
})
export class ActionbarComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public dialog: MatDialog) {}

  settingsOptions: Array<String> = [
    'Account',
    'Connectivity',
    'Pro Version'
  ];
  openSettings(): void {
    const dialogRef = this.dialog.open(SettingsDialog, {
      width: '300px',
      data: this.settingsOptions
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  uploadAction(): void {
    this.changeIcon();
  }

  downloadAction(): void {
    this.changeIcon();
  }

  changeIcon(): void {
    let mainFAB = $('#cloud_main_fab');
    if(this.isCloud(mainFAB)) {
      mainFAB.text('close');
    } else {
      mainFAB.text('cloud');
    }
  }

  isCloud(mainFAB: JQuery): boolean {
    if(mainFAB.text().trim() == 'cloud') {
      return true;
    } else {
      return false;
    }
  }

}