import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '../types/enums';

export interface JwtPayload {
  id: string;
  userId: string;
  email: string;
  role: Role;
  studentId?: string;
}

export class JwtUtil {
  public static generateToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as any,
    };
    return jwt.sign(payload, env.JWT_SECRET, options);
  }

  public static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  }
}
