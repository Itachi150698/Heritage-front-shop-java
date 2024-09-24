import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoAngularMaterialModule } from '../DemoAngularMaterialModule';
import { HeaderComponent } from './partials/header/header.component';
import { FooterComponent } from './partials/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { ToastrModule } from 'ngx-toastr';
import { SearchComponent } from './partials/search/search.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { OrderByStatusComponent } from './pages/analytics/order-by-status/order-by-status.component';
import { PostCategoryComponent } from './pages/post-category/post-category.component';
import { PostProductComponent } from './pages/post-product/post-product.component';
import { UpdateProductComponent } from './pages/update-product/update-product.component';
import { PostCouponComponent } from './pages/post-coupon/post-coupon.component';
import { CouponsComponent } from './pages/coupons/coupons.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PostProductFaqComponent } from './pages/post-product-faq/post-product-faq.component';


@NgModule({
  declarations: [
    AdminComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SearchComponent,
    AnalyticsComponent,
    OrderByStatusComponent,
    PostCategoryComponent,
    PostProductComponent,
    UpdateProductComponent,
    PostCouponComponent,
    CouponsComponent,
    OrdersComponent,
    PostProductFaqComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
     FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DemoAngularMaterialModule,
    ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        newestOnTop: false
    }),
  ],
   exports: [
    AdminComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
  ]
})
export class AdminModule { }
