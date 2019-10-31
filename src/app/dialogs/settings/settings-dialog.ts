import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    templateUrl: './settings-dialog.html',
})
export class SettingsDialog {

    options: Array<String>;
    constructor(public dialogRef: MatDialogRef<SettingsDialog>, @Inject(MAT_DIALOG_DATA) public data: Array<String>) { 
        this.options = data;
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}