import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServerConnection } from '../p2p';

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

@NgModule({
  declarations: [
    AppComponent,
    ActionbarComponent,
    MainSiteComponent,
    DownloadSiteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    DialogComponentsModule,
    NgbModule,
    SnackbarComponentsModule
  ],
  providers: [
    { provide: ServerConnection, useValue: new ServerConnection() }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    this.registerServiceWorker();
  }

  private registerServiceWorker(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('../service-worker.js')
        .then((registration) =>
          console.log(`Service Worker registration complete, scope: '${registration.scope}'`))
        .catch((error) =>
          console.log(`Service Worker registration failed with error: '${error}'`));
    }
  }
}
