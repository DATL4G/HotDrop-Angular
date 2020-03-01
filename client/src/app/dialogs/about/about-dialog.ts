import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  templateUrl: './about-dialog.html',
})
export class AboutDialog {

  constructor(public dialogRef: MatDialogRef<AboutDialog>) { }

  closeDialog(): void {
    this.dialogRef.close(null);
  }

  openPrivacyPolicy(): void {
    this.dialogRef.close(null);
    let win = window.open('https://interaapps.de/dsgvo', '_blank');
    win.focus();
  }
}
