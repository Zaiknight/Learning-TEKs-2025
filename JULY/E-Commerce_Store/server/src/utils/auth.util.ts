// server/src/utils/auth.util.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; 
import dotenv from 'dotenv';


const SALT_ROUNDS = 12;
const JWT_KEY = process.env.JWT_KEY as string;

export const AuthUtil = {
  // Hash plain password
  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  },

  // Compare plain password with hash
  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const check : boolean = await bcrypt.compare(plainPassword, hashedPassword);
    return check;
  },

  // Generate JWT token
  generateToken(payload: { id: number; email: string }): string {
    return jwt.sign(payload, JWT_KEY, { expiresIn: '1h' });
  },
  

  // Verify JWT token
  verifyToken(token: string): any {
    return jwt.verify(token, JWT_KEY);
  },
};
