import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';
import { LoginModel } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private LOGIN_URL = `http://localhost:8080/auth/login`;
  private DETAILS_URL = `http://localhost:8080/api/details`;
  private USERS_URL = `http://localhost:8080/api/users`;

  constructor(private http: HttpClient) {
  }

  loginUser(loginModel: LoginModel): Observable<boolean> {
    return this.http.post<boolean>(this.LOGIN_URL, {
      email: loginModel.email,
      password: loginModel.password
    });
  }

  getUserInfo(): Observable<UserModel> {
    return this.http.get<UserModel>(this.DETAILS_URL);
  }

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.USERS_URL);
  }

  addUser(user: UserModel): Observable<boolean> {
    return this.http.post<boolean>(this.USERS_URL, {
      name: user.name,
      email: user.email,
      age: 29,
      role: 'USER'
    });
  }
}
