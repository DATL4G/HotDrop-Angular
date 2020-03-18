import { Component, Inject } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
    templateUrl: './socket-connect-snackbar.html',
    styleUrls: [
        './socket-connect-snackbar.scss'
    ]
  })
  export class SocketConnectSnackbar {

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {

    }

  }
