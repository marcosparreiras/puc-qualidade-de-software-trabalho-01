import { GlobalPasswordEncoder } from "../utils/global-password-encoder";

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
    const cipher = await GlobalPasswordEncoder.getInstance().hash(plain);
    return new Password(cipher);
  }

  public async compare(plain: string): Promise<boolean> {
    return GlobalPasswordEncoder.getInstance().compare(plain, this.cipher);
  }
}
