import { dataSource } from "../app-data-source";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { User } from "../entity/user.entity"
import AppError from "../utils/appError";

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
            throw new AppError(`User not found`, 404);
        }
        return result
    }

    public async getUserById(id: number):Promise<User> {

        const result = await this.userRepository.findOne( { where: { id }, withDeleted: true})
        if (!result) {
            throw new AppError(`User with id ${id} not found`, 404);
        }
        return result
    }

    public async getUserByEmail(email: string):Promise<User> {
        const result = await this.userRepository.findOne({ where: { email } })
        
        if (!result) {
            throw new AppError(`User with email ${email} not found`, 404);
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
            throw new AppError(`No active user found with id ${id} to delete.`, 404);
        }

        const deletedUser = await this.getUserById(id)
        
        return deletedUser
    }

    public async restoreUserById(id: number):Promise<User> {

        const restoreResult = await this.userRepository.restore(id)

        if (restoreResult.affected === 0) {
            throw new AppError(`No deleted user found with id ${id} to restore.`, 404);
        }

        const restoredUser = await this.getUserById(id)
        
        return restoredUser
    }
}