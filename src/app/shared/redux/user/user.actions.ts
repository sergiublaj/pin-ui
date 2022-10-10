import { UserModel } from '../../models/user.model';

export class GetUserInfo {
  static readonly type = '[User] Get User Info';

  constructor() {}
}

export class LogoutUser {
  static readonly type = '[User] Logging Out User';

  constructor() {}
}

export class GetUsers {
  static readonly type = '[User] Get Users';

  constructor() {}
}

export class AddUser {
  static readonly type = '[User] Add User';

  constructor(readonly user: UserModel) {}
}
