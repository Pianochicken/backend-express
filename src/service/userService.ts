import { CreateUserModel } from "../model/userModel";
import { UserRepository } from "../repository/userRepository"

export class UserService {
  public userRepository = new UserRepository
  
  public createUser(payload: CreateUserModel) {
    const result = this.userRepository.createUser(payload)

    return result
  }

  public getUsers() {
    const result = this.userRepository.getUsers()

    return result
  }

  public getUserById(id: number) {
    const result = this.userRepository.getUserById(id)

    return result
  }

  public getUserByEmail(email: string) {
    const result = this.userRepository.getUserByEmail(email)

    return result
  }

}