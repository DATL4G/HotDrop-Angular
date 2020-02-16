import {Component, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, from } from 'rxjs';
import { map, shareReplay, delay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsDialog } from '../dialogs/settings/settings-dialog';
import * as global from '../../environments/global';
import * as $ from 'jquery';


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

  checked = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {
    $('#show').prop('checked', this.checked);
    $(function () {
      $('#closer').hide();
      $('#settings').show();
    });
  }

  openSettings(): void {
    const dialogRef = this.dialog.open(SettingsDialog, {
      width: global.dialogWidth,
      data: global.settingsOptions
    });

    dialogRef.afterClosed().subscribe(result => {
      switch (result) {
        case 0:
          break;
      }
    });
  }

  openInfo(): void {
    this.checked = !this.checked;
    $('#show').prop('checked', this.checked);

    if(this.checked) {
      $('#closer').show();
      $('#settings').hide();
    } else {
      setTimeout(() => {
        $('#closer').hide();
        $('#settings').show();
      }, 500);
    }
  }

}
