import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SocketConnectSnackbar } from './socket-connect/socket-connect-snackbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
    imports: [
        CommonModule,
        MatSnackBarModule
    ],
    declarations: [
        SocketConnectSnackbar
    ],
    entryComponents: [
        SocketConnectSnackbar
    ]
})
export class SnackbarComponentsModule { }
