import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Route,
    SuccessResponse,
    Tags,
} from "tsoa";
import { User, CreateUserModel } from "../model/userModel";
import { UserService } from "../service/userService";

const userService = new UserService

@Route("user")
@Tags("User")
export class UserController extends Controller {
    @Get("{id}")
    public async getUser(
        @Path() id: number,
    ): Promise<User> {
        const result = userService.getUserById(id)
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