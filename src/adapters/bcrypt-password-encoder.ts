import bcrypt from "bcryptjs";
import type { PasswordEncoder } from "../domain/bondaries/password-encoder";

export class BcryptPasswordEncoder implements PasswordEncoder {
  async compare(plain: string, cipher: string): Promise<boolean> {
    return bcrypt.compare(plain, cipher);
  }

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 6);
  }
}
