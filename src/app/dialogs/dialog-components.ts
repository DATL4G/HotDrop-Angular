import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsDialog } from './settings/settings-dialog';
import { MatButtonModule, MatListModule, MatSnackBarModule } from '@angular/material';
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