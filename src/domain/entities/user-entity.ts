import { InvalidUserPassword } from "../exceptions/invalid-user-password-exception";
import type { Password } from "../value-objects/password";
import { DomainEntity } from "./domain-entity";

interface UserEntityProps {
  name: string;
  email: string;
  password: Password;
}

export class UserEntity extends DomainEntity<UserEntityProps> {
  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.password.hash;
  }

  public authenticate(password: string): void {
    const isAuthenticaded = this.props.password.compare(password);
    if (!isAuthenticaded) {
      throw new InvalidUserPassword();
    }
  }

  public chagePassword(oldPassword: string, newPassword: Password): void {
    this.authenticate(oldPassword);
    this.props.password = newPassword;
  }

  protected constructor(props: UserEntityProps, id?: string) {
    super(props, id);
  }

  public static load(props: UserEntityProps, id: string) {
    return new UserEntity(props, id);
  }

  public static create(props: UserEntityProps) {
    return new UserEntity(props);
  }
}
