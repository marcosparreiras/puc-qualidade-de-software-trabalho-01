export interface PasswordEncoder {
  compare(plain: string, cipher: string): Promise<boolean>;
  hash(plain: string): Promise<string>;
}
