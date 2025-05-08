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

    public async getUsers():Promise<User[]>{

        const result = await this.userRepository.find({})
        if (!result) {
            throw new Error(`User not found`);
        }
        return result
    }

    public async getUserById(id: number):Promise<User>{

        const result = await this.userRepository.findOneBy({ id })
        if (!result) {
            throw new Error(`User with id ${id} not found`);
        }
        return result
    }

    public async getUserByEmail(email: string):Promise<User>{
        const result = await this.userRepository.findOneBy({ email })
        
        if (!result) {
            throw new Error(`User with email ${email} not found`);
        }
        return result
    }
}