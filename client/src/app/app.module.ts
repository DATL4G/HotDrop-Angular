import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActionbarComponent } from './actionbar/actionbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from './material';
import { DialogComponentsModule } from './dialogs/dialog-components';
import { MainSiteComponent } from './main-site/main-site.component';
import { SnackbarComponentsModule } from './snackbars/snackbar-components';
import { DownloadSiteComponent } from './download-site/download-site.component';
import { InfoLayoutComponent } from './info-layout/info-layout.component';
import { GsapAnimationService } from "./animation/gsap-animation.service";
import { AdBlockDetector } from './anti-adblock/adblock-detector';
import { HostComponent } from './host/host.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { IpcService } from "./ipc-service/ipc.service";

@NgModule({
  declarations: [
    AppComponent,
    ActionbarComponent,
    MainSiteComponent,
    DownloadSiteComponent,
    InfoLayoutComponent,
    HostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    DialogComponentsModule,
    SnackbarComponentsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [GsapAnimationService, AdBlockDetector, IpcService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(adBlockDetector: AdBlockDetector) {
    adBlockDetector.init();
  }
}
