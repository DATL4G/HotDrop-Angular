import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    templateUrl: './accountselect-dialog.html',
    styleUrls: ['./accountselect-dialog.scss']
})
export class AccountSelectDialog {

    options: Array<String>;
    constructor(public dialogRef: MatDialogRef<AccountSelectDialog>,
        @Inject(MAT_DIALOG_DATA) public data: Array<String>) {
        this.options = data;
    }

    

    closeDialog(): void {
        this.dialogRef.close();
    }

    chooseProvider(pos: number): void {
        this.dialogRef.close(pos);
    }
}
