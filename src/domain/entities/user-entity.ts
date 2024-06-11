import { InvalidUserPassword } from "../exceptions/invalid-user-password-exception";
import { Password } from "../value-objects/password";
import { DomainEntity } from "./domain-entity";

interface UserEntityProps {
  name: string;
  email: string;
  password: Password;
}

type UserEntityPropsWithPlainTextPassword = Omit<
  UserEntityProps,
  "password"
> & {
  password: string;
};

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

  public chagePassword(oldPassword: string, newPassword: string): void {
    this.authenticate(oldPassword);
    this.props.password = Password.create(newPassword);
  }

  protected constructor(props: UserEntityProps, id?: string) {
    super(props, id);
  }

  public static load(props: UserEntityPropsWithPlainTextPassword, id: string) {
    return new UserEntity(this.makePropsWithHahedPassword(props), id);
  }

  public static create(props: UserEntityPropsWithPlainTextPassword) {
    return new UserEntity(this.makePropsWithHahedPassword(props));
  }

  private static makePropsWithHahedPassword(
    props: UserEntityPropsWithPlainTextPassword
  ): UserEntityProps {
    return { ...props, password: Password.create(props.password) };
  }
}
