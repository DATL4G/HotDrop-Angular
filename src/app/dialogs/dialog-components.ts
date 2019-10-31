import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsDialog } from './settings/settings-dialog';
import { MatButtonModule, MatListModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatListModule
    ],
    declarations: [
        SettingsDialog
    ],
    entryComponents: [
        SettingsDialog
    ]
})
export class DialogComponentsModule{ }