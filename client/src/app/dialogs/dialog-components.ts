import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsDialog } from './settings/settings-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DependenciesDialog } from "./dependencies/dependencies-dialog";
import {AdBlockDialog} from "./adblock/adblock-dialog";

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatListModule,
        MatSnackBarModule
    ],
    declarations: [
        SettingsDialog,
        DependenciesDialog,
        AdBlockDialog
    ],
    entryComponents: [
        SettingsDialog,
        DependenciesDialog,
        AdBlockDialog
    ]
})
export class DialogComponentsModule{ }
