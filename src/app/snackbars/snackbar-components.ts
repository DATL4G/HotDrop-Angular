import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthWelcomeSnackbar } from './auth-welcome/auth-welcome-snackbar';
import { MatSnackBarModule } from '@angular/material';


@NgModule({
    imports: [
        CommonModule,
        MatSnackBarModule
    ],
    declarations: [
        AuthWelcomeSnackbar
    ],
    entryComponents: [
        AuthWelcomeSnackbar
    ]
})
export class SnackbarComponentsModule { }