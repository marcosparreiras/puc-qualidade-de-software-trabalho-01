import type { Sql } from "postgres";
import { FakeUserFactory } from "../../domain/test-utils/fake-user-factory";
import {
  UserEntity,
  UserEntityPropsWithPlainTextPassword,
} from "../../domain/entities/user-entity";

export class FakePostgresUserFactory {
  public static async mankeOne(
    dbConnection: Sql,
    partialProps: Partial<UserEntityPropsWithPlainTextPassword> = {},
    id?: string
  ): Promise<UserEntity> {
    const inMemoryUser = await FakeUserFactory.makeOne(partialProps, id);
    await dbConnection`INSERT INTO users(_id, name, email, password)
          VALUES(${inMemoryUser.id}, ${inMemoryUser.name},
          ${inMemoryUser.email}, ${inMemoryUser.passwordHash})`;
    return inMemoryUser;
  }

  public static async makeMany(
    dbConnection: Sql,
    count: number
  ): Promise<UserEntity[]> {
    const inMemoryUsers: UserEntity[] = [];

    for (let i = 0; i < count; i++) {
      const inMemoryUser = await FakeUserFactory.makeOne();
      await dbConnection`INSERT INTO users(_id, name, email, password)
            VALUES(${inMemoryUser.id}, ${inMemoryUser.name},
            ${inMemoryUser.email}, ${inMemoryUser.passwordHash})`;
      inMemoryUsers.push(inMemoryUser);
    }

    return inMemoryUsers;
  }
}
