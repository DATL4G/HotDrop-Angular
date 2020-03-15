import {Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsDialog } from '../dialogs/settings/settings-dialog';
import * as global from '../../environments/global';
import * as $ from 'jquery';
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-actionbar',
  templateUrl: './actionbar.component.html',
  styleUrls: ['./actionbar.component.scss']
})
export class ActionbarComponent {

  checked = false;
  globals: global.Globals;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {
    this.globals = new global.Globals(breakpointObserver);

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
