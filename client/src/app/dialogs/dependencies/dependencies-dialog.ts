import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './dependencies-dialog.html',
})
export class DependenciesDialog {

  options: Array<String>;
  constructor(public dialogRef: MatDialogRef<DependenciesDialog>, @Inject(MAT_DIALOG_DATA) public data: Array<String>) {
    this.options = data;
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }

  showPos(pos: number): void {
    this.dialogRef.close(pos);
  }
}
