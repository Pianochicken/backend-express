import {
  Body,
  Controller,
  Post,
  Route,
  Tags
} from "tsoa";
import type { LoginRequestModel, LoginResponseModel } from "../model/authModel.js";
import { AuthService } from "../service/authService.js";

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  private authService = new AuthService();

  @Post("login")
  public async login(
    @Body() requestBody: LoginRequestModel
    ): Promise<LoginResponseModel> {
    const result = await this.authService.login(requestBody);
    return result;
  }
}