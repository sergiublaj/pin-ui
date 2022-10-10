import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../global-elements/base/base.component';
import { Observable, takeUntil } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { UserModel } from '../../../shared/models/user.model';
import { UserState } from '../../../shared/redux/user/user.state';
import { GetUserInfo, GetUsers, LogoutUser } from '../../../shared/redux/user/user.actions';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MIN_LENGTH } from '../../../core/constants/form.constants';
import { UserService } from '../../../shared/services/user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent extends BaseComponent implements OnInit {
  @Select(UserState.getUserInfo)
  private userInfo$: Observable<UserModel | undefined>;
  userInfo: UserModel;
  @Select(UserState.getUsers)
  private users$: Observable<UserModel[] | undefined>;
  users: UserModel[];

  userForm: FormGroup;
  formSubmitted = false;
  formMessage: string | null = null;
  isLoading = false;
  isAdmin = false;

  constructor(private store: Store,
              private router: Router,
              private cookieService: CookieService,
              private userService: UserService,
              private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.watchUserInfo();
    this.watchUsers();
    this.buildForm();
  }

  private watchUserInfo() {
    this.store.dispatch(new GetUserInfo());
    this.userInfo$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(result => {
        if (result) {
          this.userInfo = result;
          this.isAdmin = this.userInfo.role === 'ADMIN';
        }
    });
  }

  private watchUsers() {
    this.store.dispatch(new GetUsers());
    this.users$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          this.users = result;
        }
      });
  }

  private buildForm() {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(MIN_LENGTH)]],
      email: ['', [Validators.required, Validators.minLength(MIN_LENGTH)]]
    });
  }

  logout() {
    this.cookieService.delete('jwtToken');
    this.store.dispatch(new LogoutUser());
    this.router.navigate(['/login']);
  }

  addUser() {
    this.isLoading = true;
    this.formSubmitted = true;

    if (this.name?.errors || this.email?.errors) {
      this.isLoading = false;
      return;
    }

    const credentials = {
      name: this.name?.value,
      email: this.email?.value,
    } as UserModel;

    this.userService.addUser(credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.formMessage = 'User successfully added';
        setTimeout(() => this.formMessage = null, 3000);
      },
      error: () => {
        this.isLoading = false;
        this.formMessage = 'You are not allowed';
        setTimeout(() => this.formMessage = null, 3000);
      }
    });

    this.store.dispatch(new GetUsers());
  }

  get name(): FormControl {
    return this.userForm.controls['name'] as FormControl;
  }

  get email(): FormControl {
    return this.userForm.controls['email'] as FormControl;
  }
}
