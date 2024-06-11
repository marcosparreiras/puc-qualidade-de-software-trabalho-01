import type { PasswordEncoder } from "../bondaries/password-encoder";

export class Password {
  private cipher: string;
  private passwordEncoder: PasswordEncoder;

  get hash() {
    return this.cipher;
  }

  private constructor(cipher: string, passwordEncoder: PasswordEncoder) {
    this.cipher = cipher;
    this.passwordEncoder = passwordEncoder;
  }

  public static laod(cipher: string, passwordEncoder: PasswordEncoder) {
    return new Password(cipher, passwordEncoder);
  }

  public static create(plain: string, passwordEncoder: PasswordEncoder) {
    const cipher = passwordEncoder.hash(plain);
    return new Password(cipher, passwordEncoder);
  }

  public compare(plain: string) {
    return this.passwordEncoder.compare(plain, this.cipher);
  }
}
