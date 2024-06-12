import type { PasswordEncoder } from "../bondaries/password-encoder";
import { EncoderNotRegisteredException } from "../exceptions/encoder-not-registered-exception";

export class PasswordEncoderRegistry {
  private static passwordEncoder: PasswordEncoder | null;

  public static set(passwordEncoder: PasswordEncoder | null) {
    this.passwordEncoder = passwordEncoder;
  }

  public static get(): PasswordEncoder {
    if (!this.passwordEncoder) {
      throw new EncoderNotRegisteredException();
    }
    return this.passwordEncoder;
  }
}
