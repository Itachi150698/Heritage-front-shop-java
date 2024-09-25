import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { OrderByStatusComponent } from './pages/analytics/order-by-status/order-by-status.component';
import { CouponsComponent } from './pages/coupons/coupons.component';
import { HomeComponent } from './pages/home/home.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PostCategoryComponent } from './pages/post-category/post-category.component';
import { PostCouponComponent } from './pages/post-coupon/post-coupon.component';
import { PostProductComponent } from './pages/post-product/post-product.component';
import { PostProductFaqComponent } from './pages/post-product-faq/post-product-faq.component';
import { UpdateProductComponent } from './pages/update-product/update-product.component';
import { FooterComponent } from './partials/footer/footer.component';
import { HeaderComponent } from './partials/header/header.component';
import { SearchComponent } from './partials/search/search.component';


@NgModule({
  declarations: [
    AdminComponent,
    AnalyticsComponent,
    OrderByStatusComponent,
    CouponsComponent,
    HomeComponent,
    OrdersComponent,
    PostCategoryComponent,
    PostCouponComponent,
    PostProductComponent,
    PostProductFaqComponent,
    UpdateProductComponent,
    FooterComponent,
    HeaderComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  exports:[
    AdminComponent,
    FooterComponent,
    HeaderComponent
  ]
})
export class AdminModule { }
