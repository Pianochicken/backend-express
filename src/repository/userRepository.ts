import { dataSource } from "../app-data-source";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
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

    public async updateUser(payload: UpdateUserDto):Promise<User>{
        const existingUser = await this.userRepository.findOneBy( { id: payload.id });
        if (!existingUser) {
          throw new Error("User not found.");
        }

        existingUser.email = payload.email
        existingUser.name = payload.name
        existingUser.password = payload.password

        const result = await this.userRepository.save(existingUser)
        
        return result
    }
}