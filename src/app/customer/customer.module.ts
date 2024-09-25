import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { CartComponent } from './pages/cart/cart.component';
import { HomeComponent } from './pages/home/home.component';
import { PlaceOrderComponent } from './pages/place-order/place-order.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { ViewProductDetailComponent } from './pages/view-product-detail/view-product-detail.component';
import { ViewWishlistComponent } from './pages/view-wishlist/view-wishlist.component';
import { FooterComponent } from './partials/footer/footer.component';
import { HeaderComponent } from './partials/header/header.component';
import { ProductListComponent } from './pages/product-list/product-list.component';


@NgModule({
  declarations: [
    CustomerComponent,
    CartComponent,
    HomeComponent,
    PlaceOrderComponent,
    SignupComponent,
    LoginComponent,
    ViewProductDetailComponent,
    ViewWishlistComponent,
    FooterComponent,
    HeaderComponent,
    ProductListComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule
  ],
  exports:[
    CustomerComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent
  ]
})
export class CustomerModule { }
