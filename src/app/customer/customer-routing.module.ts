import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsListComponent } from './partials/products-list/products-list.component';
import { customerGuard } from './services/customer.guard';
import { ViewProductDetailComponent } from './pages/view-product-detail/view-product-detail.component';
import { ViewWishlistComponent } from './pages/view-wishlist/view-wishlist.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { authGuard } from './services/auth.guard';
import { PlaceOrderComponent } from './pages/place-order/place-order.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';


const routes: Routes = [{ path: '', component: CustomerComponent, canActivate: [customerGuard] },
  {path:'home', component: HomeComponent},
  { path: 'products-list', component: ProductsListComponent},
  { path: 'product/:productId', component: ViewProductDetailComponent },
  { path: 'wishlist', component: ViewWishlistComponent, canActivate: [customerGuard] },
  { path: 'cart', component: CartComponent, canActivate:[customerGuard] },
  {path: 'login', component:LoginComponent, canActivate:[authGuard]},
  {path:'signup', component:SignupComponent},
  {path:'checkout/:id', component:PlaceOrderComponent},
  {path:'my-orders', component:MyOrdersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
