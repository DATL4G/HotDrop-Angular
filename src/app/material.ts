import { NgModule } from '@angular/core';
import {
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatGridListModule,
  MatSlideToggleModule,
  MatDialogModule
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
    EcoFabSpeedDialModule
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
    EcoFabSpeedDialModule
  ],
})
export class MaterialModule { }
