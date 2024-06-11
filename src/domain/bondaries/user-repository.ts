import type { UserEntity } from "../entities/user-entity";

export interface UserRepository {
  findMany(page: number): Promise<UserEntity[]>;
}
