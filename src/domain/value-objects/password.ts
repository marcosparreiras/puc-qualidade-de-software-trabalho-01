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

  public static create(plain: string) {
    const cipher = GlobalPasswordEncoder.getInstance().hash(plain);
    return new Password(cipher);
  }

  public compare(plain: string) {
    return GlobalPasswordEncoder.getInstance().compare(plain, this.cipher);
  }
}
