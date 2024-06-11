import type { UserEntity } from "../entities/user-entity";

export interface UserRepository {
  findMany(page: number): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<void>;
  save(user: UserEntity): Promise<void>;
}
