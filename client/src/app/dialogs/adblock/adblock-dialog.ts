import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  templateUrl: './adblock-dialog.html',
})
export class AdBlockDialog {

  constructor(public dialogRef: MatDialogRef<AdBlockDialog>) { }

  closeDialog(): void {
    this.dialogRef.close(null);
  }

  showPos(pos: number): void {
    this.dialogRef.close(pos);
  }
}
