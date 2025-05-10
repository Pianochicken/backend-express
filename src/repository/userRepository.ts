import { DeleteResult } from "typeorm";
import { dataSource } from "../app-data-source";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { User } from "../entity/user.entity"

export class UserRepository {

    public userRepository = dataSource.getRepository(User)

    public async createUser(payload: CreateUserDto):Promise<User> {

        const user = this.userRepository.create(payload)
        const result = await this.userRepository.save(user)
    
        return result
    }

    public async getUsers():Promise<User[]> {

        const result = await this.userRepository.find({})
        if (!result) {
            throw new Error(`User not found`);
        }
        return result
    }

    public async getUserById(id: number):Promise<User> {

        const result = await this.userRepository.findOne( { where: { id }, withDeleted: true})
        if (!result) {
            throw new Error(`User with id ${id} not found`);
        }
        return result
    }

    public async getUserByEmail(email: string):Promise<User> {
        const result = await this.userRepository.findOne({ where: { email } })
        
        if (!result) {
            throw new Error(`User with email ${email} not found`);
        }
        return result
    }

    public async updateUser(payload: UpdateUserDto):Promise<User> {
        const existingUser = await this.getUserById(payload.id)

        existingUser.email = payload.email
        existingUser.name = payload.name
        existingUser.password = payload.password

        const result = await this.userRepository.save(existingUser)
        
        return result
    }

    public async deleteUserById(id: number):Promise<User> {

        const deleteResult = await this.userRepository.softDelete(id);

        if (deleteResult.affected === 0) {
            throw new Error(`No active user found with id ${id} to delete.`);
        }

        const deletedUser = await this.getUserById(id)
        
        return deletedUser
    }

    public async restoreUserById(id: number):Promise<User> {

        const restoreResult = await this.userRepository.restore(id)

        if (restoreResult.affected === 0) {
            throw new Error(`No deleted user found with id ${id} to restore.`);
        }

        const restoredUser = await this.getUserById(id)
        
        return restoredUser
    }
}