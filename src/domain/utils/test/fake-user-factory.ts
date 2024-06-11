import {
  UserEntity,
  type UserEntityPropsWithPlainTextPassword,
} from "../../entities/user-entity";
import { faker } from "@faker-js/faker";

export class FakeUserFactory {
  static makeOne(
    partialProps: Partial<UserEntityPropsWithPlainTextPassword> = {},
    id?: string
  ): UserEntity {
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

  static makeMany(num: number): UserEntity[] {
    const users: UserEntity[] = [];
    for (let i = 0; i < num; i++) {
      users.push(this.makeOne());
    }
    return users;
  }
}
