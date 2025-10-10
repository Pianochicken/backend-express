import { Request } from "express";
import { AuthService } from "../service/authService";
import AppError from "../utils/appError";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const authService = new AuthService();

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "jwt") {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided. Please log in to get access.", 401);
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = authService.verifyToken({
        token, 
        jwtSecret: JWT_SECRET
      });
      // You can optionally attach the user to the request for use in controllers
      // (request as any).user = decoded;
      return decoded;
    } catch (err) {
      throw new AppError("Invalid or expired token.", 401);
    }
  }

  // Fallback for unhandled security schemes
  throw new AppError("Unhandled security scheme.", 500);
}
