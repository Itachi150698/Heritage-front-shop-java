import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { HomeComponent } from './pages/home/home.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { adminGuard } from './services/admin.guard';
import { CouponsComponent } from './pages/coupons/coupons.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PostCategoryComponent } from './pages/post-category/post-category.component';
import { PostCouponComponent } from './pages/post-coupon/post-coupon.component';
import { PostProductFaqComponent } from './pages/post-product-faq/post-product-faq.component';
import { PostProductComponent } from './pages/post-product/post-product.component';
import { UpdateProductComponent } from './pages/update-product/update-product.component';

const routes: Routes = [{ path: '', component: AdminComponent },
{ path: 'home', component: HomeComponent },
{ path: 'analytics', component: AnalyticsComponent },
{ path: 'category', component: PostCategoryComponent },
{ path: 'product', component: PostProductComponent },
{ path: 'product/:productId', component: UpdateProductComponent },
{ path: 'post-coupon', component: PostCouponComponent },
{ path: 'coupons', component: CouponsComponent },
{ path: 'orders', component: OrdersComponent },
{ path: 'faq/:productId', component: PostProductFaqComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
