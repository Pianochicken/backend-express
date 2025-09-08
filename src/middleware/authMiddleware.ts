import { Request } from "express";
import { AuthService } from "../service/authService";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const authService = new AuthService();

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  const authHeader = request.headers.authorization;

  if (securityName === "jwt") {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("No token provided.");
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = authService.verifyToken({
        token, 
        jwtSecret: JWT_SECRET
      });
      (request as any).user = decoded; // attach decoded user to request
      return decoded;
    } catch (err) {
      throw new Error("Invalid or expired token.");
    }
  }
}
