import {
  Body,
  Controller,
  Post,
  Route,
  Tags
} from "tsoa";
import { LoginRequestModel, LoginResponseModel } from "../model/authModel"
import { AuthService } from "../service/authService";

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