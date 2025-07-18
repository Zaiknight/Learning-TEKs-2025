// server/src/utils/auth.util.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const AuthUtil = {
  // Hash plain password
  hashPassword: async (password: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  },

  // Compare plain password with hash
  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  // Generate JWT token
  generateToken(payload: { id: number; email: string }): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
  },
  

  // Verify JWT token
  verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  },
};
