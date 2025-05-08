import { dataSource } from "../app-data-source";
import { CreateUserDto } from "../dto/user.dto";
import { User } from "../entity/user.entity"

export class UserRepository {

    public userRepository = dataSource.getRepository(User)

    public async createUser(payload: CreateUserDto) {

        const user = this.userRepository.create(payload)
        const result = await this.userRepository.save(user)
    
        return result
    }
}