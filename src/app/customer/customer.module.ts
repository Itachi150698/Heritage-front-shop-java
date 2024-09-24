import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './partials/header/header.component';
import { FooterComponent } from './partials/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoAngularMaterialModule } from '../DemoAngularMaterialModule';
import { ToastrModule } from 'ngx-toastr';
import { ProductsListComponent } from './partials/products-list/products-list.component';
import { AdminModule } from "../admin/admin.module";
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ViewProductDetailComponent } from './pages/view-product-detail/view-product-detail.component';
import { ViewWishlistComponent } from './pages/view-wishlist/view-wishlist.component';
import { CartComponent } from './pages/cart/cart.component';
import { PlaceOrderComponent } from './pages/place-order/place-order.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';


@NgModule({
  declarations: [
    CustomerComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ProductsListComponent,
    ViewProductDetailComponent,
    ViewWishlistComponent,
    CartComponent,
    PlaceOrderComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DemoAngularMaterialModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      newestOnTop: false,
      preventDuplicates: true,
      closeButton: true,
      progressBar: true
    }),
    AdminModule,
    NgxImageZoomModule
],
  exports: [
    CustomerComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,

  ]
})
export class CustomerModule { }
