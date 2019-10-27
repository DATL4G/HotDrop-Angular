import { Component, Inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, from } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import * as $ from 'jquery';
import { MatDialog, MatSnackBar } from '@angular/material';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { SettingsDialog } from '../dialogs/settings/settings-dialog';
import * as global from '../../environments/global';
import { AccountSelectDialog } from '../dialogs/accountselect/accountselect-dialog';
import { AuthWelcomeSnackbar } from '../snackbars/auth-welcome/auth-welcome-snackbar';


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

  constructor(
    private breakpointObserver: BreakpointObserver,
    public firebaseAuth: AngularFireAuth,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.firebaseAuth.authState.pipe().subscribe(user => {
      const snackbarRef = this.snackbar.openFromComponent(AuthWelcomeSnackbar, {
        duration: global.snackbarDuration,
        data: user
      });
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
          this.openAccountSelect();
          break;
      }
    });
  }

  openAccountSelect(): void {
    const dialogRef = this.dialog.open(AccountSelectDialog, {
      width: global.dialogWidth,
      data: global.accountOptions
    });

    dialogRef.afterClosed().subscribe(result => {
      switch (result) {
        case 0:
          this.firebaseAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
          break;
      }
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
    if (this.isCloud(mainFAB)) {
      mainFAB.text('close');
    } else {
      mainFAB.text('cloud');
    }
  }

  isCloud(mainFAB: JQuery): boolean {
    if (mainFAB.text().trim() == 'cloud') {
      return true;
    } else {
      return false;
    }
  }

}