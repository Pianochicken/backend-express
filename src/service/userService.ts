import { UpdateUserDto } from "../dto/user.dto";
import { CreateUserModel, UpdateUserModel } from "../model/userModel";
import { UserRepository } from "../repository/userRepository"

export class UserService {
  public userRepository = new UserRepository
  
  public async createUser(payload: CreateUserModel) {
    const result = await this.userRepository.createUser(payload)

    return result
  }

  public async getUsers() {
    const result = await this.userRepository.getUsers()

    return result
  }

  public async getUserById(id: number) {
    const result = await this.userRepository.getUserById(id)

    return result
  }

  public async getUserByEmail(email: string) {
    const result = await this.userRepository.getUserByEmail(email)

    return result
  }
  
  public async updateUser(id: number, payload: UpdateUserModel) {
    
    const updatePayload: UpdateUserDto = {
      id,
      ...payload
    }

    const result = await this.userRepository.updateUser(updatePayload)

    return result
  }

  public async deleteUserById(id: number) {
    
    const result = await this.userRepository.deleteUserById(id)

    return result
  }
}