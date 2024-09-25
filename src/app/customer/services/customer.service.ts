import { Injectable } from '@angular/core';
import { BASE_URL } from '../../shared/constants/urls';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { UserStorageService } from '../../services/storage/user-storage.service';

const BASIC_URL = BASE_URL;
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http:HttpClient) { }

   getAllProducts(): Observable<any>{
    return this.http.get(BASIC_URL + 'api/customer/products', {
      headers: this.createAuthorizationHeader(),
    })
  }

  getAllCategories(): Observable<any>{
    return this.http.get(BASIC_URL + 'api/admin/categories', {
    })
  }

    getProductsByCategory(categoryId:number): Observable<any>{
    return this.http.get(BASIC_URL + `api/customer/products/category/${categoryId}`, {
      headers: this.createAuthorizationHeader(),
    })
  }

     getAllProductByName(name:any): Observable<any>{
    return this.http.get(BASIC_URL + `api/customer/search/${name}`, {
      headers: this.createAuthorizationHeader(),
    })
  }

   addProductToCart(productId:any): Observable<any>{
    const cartDto = {
      productId: productId,
      userId: UserStorageService.getUserId()
    }
    return this.http.post(BASIC_URL + `api/customer/cart`, cartDto,  {
      headers: this.createAuthorizationHeader(),
      observe: 'response'
    })
  }

increaseProductQuantity(productId: any): Observable<any> {
  const cartDto = {
    productId: productId,
    userId: UserStorageService.getUserId()
  };
  return this.http.post(BASIC_URL + `api/customer/addition`, cartDto, {
    headers: this.createAuthorizationHeader(),
    observe: 'response'
  }).pipe(
    catchError(error => {
      console.error('Error increasing product quantity:', error);
      return throwError(error); // or handle it as needed
    })
  );
}

decreaseProductQuantity(productId: any): Observable<any> {
  const cartDto = {
    productId: productId,
    userId: UserStorageService.getUserId()
  };
  return this.http.post(BASIC_URL + `api/customer/deduction`, cartDto, {
    headers: this.createAuthorizationHeader(),
    observe: 'response'
  }).pipe(
    catchError(error => {
      console.error('Error decreasing product quantity:', error);
      return throwError(error); // or handle it as needed
    })
  );
}


    getCartByUserId(): Observable<any>{
    const userId = UserStorageService.getUserId()
    return this.http.get(BASIC_URL + `api/customer/cart/${userId}`,  {
      headers: this.createAuthorizationHeader(),
    })
  }

  applyCoupon(code:any): Observable<any>{
    const userId = UserStorageService.getUserId()
    return this.http.get(BASIC_URL + `api/customer/coupon/${userId}/${code}`,  {
      headers: this.createAuthorizationHeader(),
    })
  }

  placeOrder(orderDto:any): Observable<any>{
    orderDto.userId = UserStorageService.getUserId()
    return this.http.post(BASIC_URL + `api/customer/placeOrder`,orderDto,  {
      headers: this.createAuthorizationHeader(),
    })
  }

    getOrdersByUserId(): Observable<any>{
    const userId = UserStorageService.getUserId()
    return this.http.get(BASIC_URL + `api/customer/myOrders/${userId}`,  {
      headers: this.createAuthorizationHeader(),
    })
  }

  getOrderedProducts(orderId:number): Observable<any>{
    return this.http.get(BASIC_URL + `api/customer/ordered-products/${orderId}`,  {
      headers: this.createAuthorizationHeader(),
    })
  }

  giveReview(reviewDto:any): Observable<any>{
    return this.http.post(BASIC_URL + `api/customer/review`, reviewDto, {
      headers: this.createAuthorizationHeader(),
    })
  }

  getProductDetailById(productId:number): Observable<any>{
    return this.http.get(BASIC_URL + `api/customer/product/${productId}`,  {
      headers: this.createAuthorizationHeader(),
    })
  }

addProductToWishlist(wishlistDto: any): Observable<any> {
  return this.http.post(BASIC_URL + `api/customer/wishlist`, wishlistDto, {
    headers: this.createAuthorizationHeader(),
    observe: 'response'
  }).pipe(
    map(response => response.body) // Make sure the response has the updated wishlist or a status
  );
}


getWishlistByUserId(): Observable<any> {
  const userId = UserStorageService.getUserId();
  return this.http.get(BASIC_URL + `api/customer/wishlist/${userId}`, {
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response as any[]) // Ensure the response is an array of wishlist items
  );
}


removeProductFromWishlist(productId: any): Observable<any> {
  const userId = UserStorageService.getUserId();
  return this.http.delete(BASIC_URL + `api/customer/wishlist/${userId}/${productId}`, {
    headers: this.createAuthorizationHeader(),
    observe: 'response'
  }).pipe(
    map(response => response.body) // Make sure the response has the updated wishlist or a status
  );
}


  removeProductFromCart(productId: any): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.delete(BASIC_URL + `api/customer/cart/${userId}/${productId}`, {
        headers: this.createAuthorizationHeader(),
    });
}


   private createAuthorizationHeader(): HttpHeaders{
    return new HttpHeaders().set(
      'Authorization', 'Bearer ' + UserStorageService.getToken()
    )
  }
}


