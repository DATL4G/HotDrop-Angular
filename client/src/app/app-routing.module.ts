import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainSiteComponent } from './main-site/main-site.component';


const routes: Routes = [
  { path: 'main', redirectTo: '/', pathMatch: 'full' },
  { path: 'index', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: MainSiteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
  MainSiteComponent
];
