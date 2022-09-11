import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './user';
import { userData } from './userData';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  API_URL: string = 'http://localhost:8080';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(private httpClient: HttpClient,public router: Router){}

  login(user: User) {
    return this.httpClient.post<any>(`${this.API_URL}/login`, user)
      .subscribe((res: any) => {
        console.log(res)
        localStorage.setItem('access_token', res.accessToken)
        this.router.navigate(["home"]);  
      },
      (error)=>{
        alert(error.error.message)
      }
      )
  }
   getUser(auth_token:string){
    let tk:string=`Bearer ${auth_token}`;
    let header = new HttpHeaders().set(
      "auth",
      tk
    ).set('Content-Type', 'application/json');
   return this.httpClient.get(`${this.API_URL}/users`, {headers:header} );
  }

  newUser(user: userData,auth_token:string) {
    let tk:string=`Bearer ${auth_token}`;
    let header = new HttpHeaders().set(
      "auth",
      tk
    ).set('Content-Type', 'application/json');
    return this.httpClient.post<any>(`${this.API_URL}/register`, user, {headers:header})
      .subscribe((res: any) => {
        alert(res.message)
         location.reload();
      },
      (error)=>{
        alert(error.error.message)
      }
      )
  }
  updateUser(user: userData,auth_token:string) {
    let tk:string=`Bearer ${auth_token}`;
    let header = new HttpHeaders().set(
      "auth",
      tk
    ).set('Content-Type', 'application/json');
    return this.httpClient.post<any>(`${this.API_URL}/update`, user, {headers:header})
      .subscribe((res: any) => {
        alert(res.message)
         location.reload();
      },
      (error)=>{
        alert(error.error.message)
      }
      )
  }
  deleteUser(user: string,auth_token:string) {
    let tk:string=`Bearer ${auth_token}`;
    let header = new HttpHeaders().set(
      "auth",
      tk
    ).set('Content-Type', 'application/json');
    return this.httpClient.post<any>(`${this.API_URL}/delete`, {"_id":user}, {headers:header})
      .subscribe((res: any) => {
        alert(res.message)
         location.reload();
      },
      (error)=>{
        alert(error.error.message)
      }
      )
  }
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  logout() {
    if (localStorage.removeItem('access_token') == null) {
      this.router.navigate(['users/login']);
    }
  }



  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}