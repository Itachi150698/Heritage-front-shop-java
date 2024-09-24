import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { UserStorageService } from '../storage/user-storage.service';
import { BASE_URL } from '../../shared/constants/urls';

const BASIC_URL = BASE_URL;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private userStorageService: UserStorageService) { }

  register(signupRequest: any): Observable<any> {
    return this.http.post(BASIC_URL + "sign-up", signupRequest).pipe(
      catchError(this.handleError)
    );
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { username, password };

    return this.http.post<any>(BASIC_URL + 'authenticate', body, { headers, observe: 'response' }).pipe(
      map((res) => {
        const token = res.headers.get('Authorization')?.substring(7);
        const user = res.body;
        if (token && user) {
          this.userStorageService.saveToken(token);
          this.userStorageService.saveUser(user);
          return user;
        }
        return null;
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    UserStorageService.signOut(); // Call instance method for logout
  }

  getOrderByTrackingId(trackingId: number): Observable<any> {
    return this.http.get(BASIC_URL + `order/${trackingId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
