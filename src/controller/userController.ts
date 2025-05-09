import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Put,
    Query,
    Route,
    SuccessResponse,
    Tags,
} from "tsoa";
import { User, CreateUserModel, UpdateUserModel } from "../model/userModel";
import { UserService } from "../service/userService";

const userService = new UserService

@Route("users")
@Tags("User")
export class UserController extends Controller {    
    @Post()
    public async createUser(
        @Body() requestBody: CreateUserModel
    ): Promise<User> {
        const result = await userService.createUser(requestBody)
        return result;
    }

    @Get("")
    public async getUsers(
    ): Promise<User[]> {
        const result = await userService.getUsers()
        return result;
    }

    @Get("id/{id}")
    public async getUserById(
        @Path() id: number,
    ): Promise<User> {
        const result = await userService.getUserById(id)
        return result;
    }

    @Get("email/{email}")
    public async getUserByEmail(
        @Path() email: string,
    ): Promise<User> {
        const result = await userService.getUserByEmail(email)
        return result;
    }

    @Put("{id}")
    public async updateUser(
        @Path() id: number,
        @Body() requestBody: UpdateUserModel
    ): Promise<User> {
        const result = await userService.updateUser(id, requestBody)
        return result;
    }
}