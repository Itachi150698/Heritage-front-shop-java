import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { HomeComponent } from './pages/home/home.component';
import { ViewProductDetailComponent } from './pages/view-product-detail/view-product-detail.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ViewWishlistComponent } from './pages/view-wishlist/view-wishlist.component';
import { customerGuard } from './services/auth-guard/customer.guard';
import { CartComponent } from './pages/cart/cart.component';
import { loginGuard } from './services/auth-guard/login.guard';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';

const routes: Routes = [{ path: '', component: CustomerComponent },
    {path:'home', component: HomeComponent},
  { path: 'products-list', component: ProductListComponent},
  { path: 'product/:productId', component: ViewProductDetailComponent },
  { path: 'wishlist', component: ViewWishlistComponent, canActivate: [customerGuard] },
  { path: 'cart', component: CartComponent, canActivate:[customerGuard] },
  {path: 'login', component:LoginComponent, canActivate:[loginGuard]},
  {path:'signup', component:SignupComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
