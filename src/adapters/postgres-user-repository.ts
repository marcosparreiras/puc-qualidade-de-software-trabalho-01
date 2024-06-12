import type postgres from "postgres";
import type { UserRepository } from "../domain/bondaries/user-repository";
import { UserEntity } from "../domain/entities/user-entity";

interface UserDataRow {
  _id: string;
  name: string;
  password: string;
  email: string;
}

export class PostgresUserRepository implements UserRepository {
  private pageSize: number = 20;
  private dbConnection: postgres.Sql;

  public constructor(dbConnection: postgres.Sql) {
    this.dbConnection = dbConnection;
  }

  private toDomain(data: UserDataRow): UserEntity {
    return UserEntity.load(
      {
        name: data.name,
        password: data.password,
        email: data.email,
      },
      data._id
    );
  }

  public async findMany(page: number): Promise<UserEntity[]> {
    const data = (await this.dbConnection`
    SELECT _id, name, password, email
    FROM users
    LIMIT ${this.pageSize} 
    OFFSET ${(page - 1) * this.pageSize};`) as UserDataRow[];
    return data.map(this.toDomain);
  }

  public async findById(id: string): Promise<UserEntity | null> {
    const data = (await this.dbConnection`
    SELECT _id, name, password, email
    FROM users
    WHERE _id = ${id}
    `) as UserDataRow[];

    if (data.length === 0) {
      return null;
    }
    return this.toDomain(data[0]);
  }

  public async existsByEmail(email: string): Promise<boolean> {
    const data = await this.dbConnection`
      SELECT _id
      FROM users
      WHERE email = ${email}
      `;
    return data.length === 0 ? false : true;
  }

  public async create(user: UserEntity): Promise<void> {
    await this.dbConnection`INSERT INTO users(_id, name, password, email)
              VALUES(${user.id}, ${user.name}, ${user.passwordHash}, ${user.email})`;
  }

  public async save(user: UserEntity): Promise<void> {
    await this.dbConnection`UPDATE users 
              SET name = ${user.name}, email = ${user.email}, password = ${user.passwordHash}
              WHERE _id = ${user.id}`;
  }
}
