import { InvalidUserPasswordExecption } from "../exceptions/invalid-user-password-exception";
import { Password } from "../value-objects/password";
import { DomainEntity } from "./utils/domain-entity";

interface UserEntityProps {
  name: string;
  email: string;
  password: Password;
}

export type UserEntityPropsWithPlainTextPassword = Omit<
  UserEntityProps,
  "password"
> & {
  password: string;
};

export class UserEntity extends DomainEntity<UserEntityProps> {
  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get email(): string {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get passwordHash(): string {
    return this.props.password.hash;
  }

  public async authenticate(password: string): Promise<void> {
    const isAuthenticaded = await this.props.password.compare(password);
    if (!isAuthenticaded) {
      throw new InvalidUserPasswordExecption();
    }
  }

  public async chagePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    await this.authenticate(oldPassword);
    this.props.password = await Password.create(newPassword);
  }

  protected constructor(props: UserEntityProps, id?: string) {
    super(props, id);
  }

  public static load(props: UserEntityPropsWithPlainTextPassword, id: string) {
    const laodProps = { ...props, password: Password.laod(props.password) };
    return new UserEntity(laodProps, id);
  }

  public static async create(props: UserEntityPropsWithPlainTextPassword) {
    const createProps = {
      ...props,
      password: await Password.create(props.password),
    };
    return new UserEntity(createProps);
  }
}
