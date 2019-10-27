import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { environmentStage } from '../environments/global';
import { FirebaseModule } from './firebase.module';

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

@NgModule({
  declarations: [
    AppComponent,
    ActionbarComponent,
    MainSiteComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environmentStage.firebase),

    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    DialogComponentsModule,
    NgbModule,
    FirebaseModule,
    SnackbarComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
