import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,
    Tags,
} from "tsoa";
import { User, CreateUserModel } from "../model/userModel";
import { UserService } from "../service/userService";

const userService = new UserService

@Route("users")
@Tags("User")
export class UserController extends Controller {    
    @Get("")
    public async getUsers(
    ): Promise<User[]> {
        const result = userService.getUsers()
        return result;
    }

    @Get("id/{id}")
    public async getUserById(
        @Path() id: number,
    ): Promise<User> {
        const result = userService.getUserById(id)
        return result;
    }

    @Get("email/{email}")
    public async getUserByEmail(
        @Path() email: string,
    ): Promise<User> {
        const result = userService.getUserByEmail(email)
        return result;
    }

    @SuccessResponse("201", "Created") // Custom success response
    @Post()
    public async createUser(
        @Body() requestBody: CreateUserModel
    ): Promise<User> {
        this.setStatus(201); // set return status 201
        const result = userService.createUser(requestBody)
        return result;
    }
}