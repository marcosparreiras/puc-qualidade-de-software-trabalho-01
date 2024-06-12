import type { UserRepository } from "../bondaries/user-repository";
import { UserEntity } from "../entities/user-entity";

export class GlobalUserRepository implements UserRepository {
  private static instance: GlobalUserRepository;
  private userRepository?: UserRepository | null;

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new GlobalUserRepository();
    }
    return this.instance;
  }

  public config(userRepository: UserRepository | null) {
    this.userRepository = userRepository;
  }

  public async findMany(page: number): Promise<UserEntity[]> {
    if (!this.userRepository) {
      throw new Error();
    }
    return this.userRepository.findMany(page);
  }

  public async findById(id: string): Promise<UserEntity | null> {
    if (!this.userRepository) {
      throw new Error();
    }
    return this.userRepository.findById(id);
  }

  public async existsByEmail(email: string): Promise<boolean> {
    if (!this.userRepository) {
      throw new Error();
    }
    return this.userRepository.existsByEmail(email);
  }

  public async create(user: UserEntity): Promise<void> {
    if (!this.userRepository) {
      throw new Error();
    }
    return this.userRepository.create(user);
  }

  public async save(user: UserEntity): Promise<void> {
    if (!this.userRepository) {
      throw new Error();
    }
    return this.userRepository.save(user);
  }

  public async delete(user: UserEntity): Promise<void> {
    if (!this.userRepository) {
      throw new Error();
    }
    return this.userRepository.delete(user);
  }
}
