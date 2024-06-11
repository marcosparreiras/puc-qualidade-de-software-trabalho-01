import type { PasswordEncoder } from "../../bondaries/password-encoder";

export class FakePasswordEncoder implements PasswordEncoder {
  private _hash: string = "-hashed";

  compare(plain: string, cipher: string): boolean {
    return plain + this._hash === cipher;
  }

  hash(plain: string): string {
    return plain + this._hash;
  }
}
