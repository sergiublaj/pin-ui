import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../global-elements/base/base.component';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { UserService } from '../../../shared/services/user.service';
import { LoginModel } from '../../../shared/models/login.model';
import { MIN_LENGTH } from '../../../core/constants/form.constants';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent extends BaseComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string | null = null;
  formSubmitted = false;
  isLoading = false;

  constructor(
    private store: Store,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildLoginForm();
  }

  private buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(MIN_LENGTH)]],
      password: ['', [Validators.required, Validators.minLength(MIN_LENGTH)]]
    });
  }

  login() {
    this.cookieService.delete('jwtToken');
    this.isLoading = true;
    this.formSubmitted = true;

    if (this.email?.errors || this.password?.errors) {
      this.isLoading = false;
      return;
    }

    const credentials = {
      email: this.email?.value,
      password: this.password?.value,
    } as LoginModel;

    this.userService.loginUser(credentials).subscribe({
      next: () => {
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/profile']), 200);
      },
      error: () => {
        this.isLoading = false;
        this.loginError = 'Login failed!';
        setTimeout(() => this.loginError = null, 3000);
      }
    });
  }

  get email(): FormControl {
    return this.loginForm.controls['email'] as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.controls['password'] as FormControl;
  }
}


