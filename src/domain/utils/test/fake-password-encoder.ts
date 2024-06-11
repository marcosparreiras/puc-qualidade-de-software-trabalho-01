import type { PasswordEncoder } from "../../bondaries/password-encoder";

export class FakePasswordEncoder implements PasswordEncoder {
  private _hash: string = "-hashed";

  public async compare(plain: string, cipher: string): Promise<boolean> {
    return plain + this._hash === cipher;
  }

  public async hash(plain: string): Promise<string> {
    return plain + this._hash;
  }
}
