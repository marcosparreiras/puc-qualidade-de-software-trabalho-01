import type { UserEntity } from "../entities/user-entity";

export interface UserRepository {
  findMany(page: number): Promise<UserEntity[]>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<void>;
}
