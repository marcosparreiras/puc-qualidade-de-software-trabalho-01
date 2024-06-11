import type { PasswordEncoder } from "../bondaries/password-encoder";
import { EncoderNotRegisteredException } from "../exceptions/encoder-not-registered-exception";

export class GlobalPasswordEncoder implements PasswordEncoder {
  private static instance: GlobalPasswordEncoder;
  private encoder?: PasswordEncoder | null;

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new GlobalPasswordEncoder();
    }
    return this.instance;
  }

  public config(encoder: PasswordEncoder | null) {
    this.encoder = encoder;
  }

  public async compare(plain: string, cipher: string): Promise<boolean> {
    if (!this.encoder) {
      throw new EncoderNotRegisteredException();
    }
    return this.encoder.compare(plain, cipher);
  }

  public async hash(plain: string): Promise<string> {
    if (!this.encoder) {
      throw new EncoderNotRegisteredException();
    }
    return this.encoder.hash(plain);
  }
}
