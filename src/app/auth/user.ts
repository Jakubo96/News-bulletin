export interface Roles {
  author?: boolean;
  admin?: boolean;
}

export class User {
  public email: string;
  public displayName: string;
  public roles: Roles;

  constructor(authData: firebase.User) {
    this.email = authData.email;
    this.displayName = authData.displayName;
    this.roles = {author: true};
  }
}

