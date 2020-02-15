import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainSiteComponent } from './main-site/main-site.component';
import {DownloadSiteComponent} from './download-site/download-site.component';


const routes: Routes = [
  { path: 'main', redirectTo: '/', pathMatch: 'full' },
  { path: 'index', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: MainSiteComponent },
  { path: 'download', component: DownloadSiteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
  MainSiteComponent,
  DownloadSiteComponent
];
