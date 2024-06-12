import { PasswordEncoderRegistry } from "../registry/password-encoder-registry";

export class Password {
  private cipher: string;

  get hash() {
    return this.cipher;
  }

  private constructor(cipher: string) {
    this.cipher = cipher;
  }

  public static laod(cipher: string) {
    return new Password(cipher);
  }

  public static async create(plain: string): Promise<Password> {
    const cipher = await PasswordEncoderRegistry.get().hash(plain);
    return new Password(cipher);
  }

  public async compare(plain: string): Promise<boolean> {
    return PasswordEncoderRegistry.get().compare(plain, this.cipher);
  }
}
