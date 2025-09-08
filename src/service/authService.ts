import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { LoginRequestModel, LoginResponseModel, generateTokenModel, verifyTokenModel, comparePasswordModel } from "../model/authModel";
import { UserRepository } from "../repository/userRepository";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "1h"; // Token expires in 1 hour

export class AuthService {
    public userRepository = new UserRepository
    
    public async login(payload: LoginRequestModel): Promise<LoginResponseModel> {

        const user = await this.userRepository.getUserByEmail(payload.email)

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isPasswordValid = await this.comparePassword({
            password: payload.password, 
            hash: user.password
        })
        
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        const token = this.generateToken({
            id: user.id,
            email: user.email,
        });

        return {
            token
        }
    }
  
    public generateToken(payload: generateTokenModel): string {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    public verifyToken(payload: verifyTokenModel) {
        return jwt.verify(payload.token, payload.jwtSecret);
    }

    public async comparePassword(payload: comparePasswordModel): Promise<boolean> {
        return await bcrypt.compare(payload.password, payload.hash);
    }
}
