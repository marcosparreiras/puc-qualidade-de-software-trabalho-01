export interface PasswordEncoder {
  compare(plain: string, cipher: string): boolean;
  hash(plain: string): string;
}
