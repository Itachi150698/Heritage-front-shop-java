import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { adminGuard } from './admin/services/admin.guard';
import { HomeComponent } from './customer/pages/home/home.component';




const routes: Routes = [
  //E-Shop
  { path: '', component: HomeComponent },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [adminGuard] },
  { path: 'customer', loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule), },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
