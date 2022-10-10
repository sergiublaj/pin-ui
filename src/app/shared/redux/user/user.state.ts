import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { AddUser, GetUserInfo, GetUsers, LogoutUser } from './user.actions';
import { UserService } from '../../services/user.service';

export interface UserStateModel {
  userInfo?: UserModel;
  users?: UserModel[];
}

const defaults = {
  userInfo: undefined,
  users: undefined
};

@State<UserStateModel>({
  name: 'user',
  defaults: defaults
})
@Injectable()
export class UserState {
  constructor(
    private store: Store,
    private userService: UserService
  ) {
  }

  @Selector()
  static getUserInfo(state: UserStateModel): UserModel | undefined {
    return state.userInfo;
  }

  @Selector()
  static getUsers(state: UserStateModel): UserModel[] | undefined {
    return state.users;
  }

  @Action(GetUserInfo)
  getUserInfo({ getState, patchState }: StateContext<UserStateModel>) {
    const stateUser = getState().userInfo;
    if (stateUser) {
      return stateUser;
    }

    return this.userService.getUserInfo().pipe(
      tap(userInfo => {
        patchState({
          userInfo
        });
      })
    );
  }

  @Action(GetUsers)
  getUsers({ patchState }: StateContext<UserStateModel>) {
    return this.userService.getUsers().pipe(
      tap(users => {
        patchState({
          users
        });
      })
    );
  }

  @Action(AddUser)
  addUser(action: AddUser) {
    return this.userService.addUser(action.user);
  }

  @Action(LogoutUser)
  logoutUser({ patchState }: StateContext<UserStateModel>) {
    return patchState({
      userInfo: undefined
    });
  }
}

