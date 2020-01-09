export interface Roles {
  author?: boolean;
  admin?: boolean;
}

export class User {
  public id: string;
  public email: string;
  public name: string;
  public roles: Roles;

  constructor(authData: firebase.User) {
    this.id = authData.uid;
    this.email = authData.email;
    this.name = authData.displayName;
    this.roles = {author: true};
  }
}

