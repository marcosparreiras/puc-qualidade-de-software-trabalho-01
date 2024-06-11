import type { UserRepository } from "../../bondaries/user-repository";
import type { UserEntity } from "../../entities/user-entity";

export class InMemoryUserRepository implements UserRepository {
  public items: UserEntity[] = [];
  public pageSize: number = 20;

  public async findMany(page: number): Promise<UserEntity[]> {
    const users = this.items.slice(
      (page - 1) * this.pageSize,
      page * this.pageSize
    );
    return users;
  }

  public async findById(id: string): Promise<UserEntity | null> {
    const user = this.items.find((item) => item.id === id);
    return user ?? null;
  }

  public async existsByEmail(email: string): Promise<boolean> {
    const index = this.items.findIndex((item) => item.email === email);
    return index === -1 ? false : true;
  }

  public async create(user: UserEntity): Promise<void> {
    this.items.push(user);
  }

  public async save(user: UserEntity): Promise<void> {
    const index = this.items.findIndex((item) => item.compare(user));
    if (index < 0) {
      return;
    }
    this.items[index] = user;
  }
}
