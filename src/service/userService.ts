import { CreateUserModel } from "../model/userModel";
import { UserRepository } from "../repository/userRepository"

export class UserService {
  public userRepository = new UserRepository
  
  public createUser(payload: CreateUserModel) {
    const result = this.userRepository.createUser(payload)

    return result
  }

  public getUserById(id: number) {
    return {
      id: id,
      name: 'Hi',
      email: 'Hi@hi.com',
      password: '12345'
    };
  }
}