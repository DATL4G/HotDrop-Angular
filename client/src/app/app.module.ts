import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActionbarComponent } from './actionbar/actionbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from './material';
import { DialogComponentsModule } from './dialogs/dialog-components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainSiteComponent } from './main-site/main-site.component';
import { SnackbarComponentsModule } from './snackbars/snackbar-components';
import { DownloadSiteComponent } from './download-site/download-site.component';
import { InfoLayoutComponent } from './info-layout/info-layout.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import {Peer} from "./p2p/Peer";
import {PeerData} from "./p2p/PeerData";
import {GsapAnimationService} from "./gsap-animation.service";

@NgModule({
  declarations: [
    AppComponent,
    ActionbarComponent,
    MainSiteComponent,
    DownloadSiteComponent,
    InfoLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    DialogComponentsModule,
    NgbModule,
    SnackbarComponentsModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [PeerData, GsapAnimationService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() { }
}
