import { CreateUserModel } from "../model/userModel";

export class UserService {
  public getUserById(id: number) {
    return {
        id: id,
        name: 'Hi',
        email: 'Hi@hi.com'
    };
  }

  public createUser(payload: CreateUserModel) {
    return {
        id: Math.floor(Math.random() * 10000), // Random
        name: payload.name,
        email: payload.email
    };
  }
}