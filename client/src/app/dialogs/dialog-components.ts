import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsDialog } from './settings/settings-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AccountSelectDialog } from './accountselect/accountselect-dialog';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatListModule,
        MatSnackBarModule
    ],
    declarations: [
        SettingsDialog,
        AccountSelectDialog
    ],
    entryComponents: [
        SettingsDialog,
        AccountSelectDialog
    ]
})
export class DialogComponentsModule{ }