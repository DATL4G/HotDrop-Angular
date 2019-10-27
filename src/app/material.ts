import { NgModule } from '@angular/core';
import {
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatGridListModule,
  MatSlideToggleModule,
  MatDialogModule,
  MatSnackBarModule
} from '@angular/material';

import {
  MdcFormFieldModule,
  MdcTextFieldModule,
  MdcCardModule,
} from '@angular-mdc/web';

import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';

@NgModule({
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MdcFormFieldModule,
    MdcTextFieldModule,
    MatCardModule,
    MatGridListModule,
    MdcCardModule,
    MatSlideToggleModule,
    MatDialogModule,
    EcoFabSpeedDialModule,
    MatSnackBarModule
  ],

  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MdcFormFieldModule,
    MdcTextFieldModule,
    MatCardModule,
    MatGridListModule,
    MdcCardModule,
    MatSlideToggleModule,
    MatDialogModule,
    EcoFabSpeedDialModule,
    MatSnackBarModule
  ],
})
export class MaterialModule { }
