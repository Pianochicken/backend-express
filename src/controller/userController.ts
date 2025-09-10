import {
    Body,
    Controller,
    Delete,
    Get,
    Path,
    Post,
    Put,
    Route,
    Security,
    Tags,
    Response,
    SuccessResponse,
} from "tsoa";
import { User, CreateUserModel, UpdateUserModel } from "../model/userModel";
import { UserService } from "../service/userService";
import AppError from "../utils/appError";

const userService = new UserService

@Route("users")
@Tags("User")
export class UserController extends Controller {    
    @Post()
    @Security("jwt")
    @SuccessResponse("201", "Created")
    @Response<AppError>(401, "Unauthorized")
    public async createUser(
        @Body() requestBody: CreateUserModel
    ): Promise<User> {
        this.setStatus(201);
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
    @Response<AppError>(404, "Not Found")
    public async getUserById(
        @Path() id: number,
    ): Promise<User> {
        const result = await userService.getUserById(id)
        return result;
    }

    @Get("email/{email}")
    @Response<AppError>(404, "Not Found")
    public async getUserByEmail(
        @Path() email: string,
    ): Promise<User> {
        const result = await userService.getUserByEmail(email)
        return result;
    }

    @Put("{id}")
    @Response<AppError>(404, "Not Found")
    public async updateUser(
        @Path() id: number,
        @Body() requestBody: UpdateUserModel
    ): Promise<User> {
        const result = await userService.updateUser(id, requestBody)
        return result;
    }

    @Delete("{id}")
    @Response<AppError>(404, "Not Found")
    public async deleteUserById(
        @Path() id: number,
    ): Promise<User> {
        const result = await userService.deleteUserById(id)
        return result;
    }

    @Put("{id}/restore")
    @Response<AppError>(404, "Not Found")
    public async restoreUserById(
        @Path() id: number,
    ): Promise<User> {
        const result = await userService.restoreUserById(id)
        return result;
    }
}