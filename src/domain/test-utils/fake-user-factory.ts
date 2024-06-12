import {
  UserEntity,
  type UserEntityPropsWithPlainTextPassword,
} from "../entities/user-entity";
import { faker } from "@faker-js/faker";

export class FakeUserFactory {
  static async makeOne(
    partialProps: Partial<UserEntityPropsWithPlainTextPassword> = {},
    id?: string
  ): Promise<UserEntity> {
    const props = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...partialProps,
    };

    return typeof id === "string"
      ? UserEntity.load(props, id)
      : UserEntity.create(props);
  }

  static async makeMany(count: number): Promise<UserEntity[]> {
    const users: UserEntity[] = [];
    for (let i = 0; i < count; i++) {
      users.push(await this.makeOne());
    }
    return users;
  }
}
