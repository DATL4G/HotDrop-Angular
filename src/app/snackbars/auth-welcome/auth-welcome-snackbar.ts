import { Component, Inject } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
    templateUrl: './auth-welcome-snackbar.html',
    styleUrls: [
        './auth-welcome-snackbar.scss'
    ]
  })
  export class AuthWelcomeSnackbar {

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: firebase.User) {

    }

  }