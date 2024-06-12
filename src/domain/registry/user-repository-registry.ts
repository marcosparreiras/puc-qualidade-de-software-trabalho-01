import type { UserRepository } from "../bondaries/user-repository";
import { UserRepositoryNotRegisteredException } from "../exceptions/user-repository-not-registered-exception";

export class UserRepositoryRegistry {
  private static userRepository: UserRepository | null;

  public static set(userRepository: UserRepository | null) {
    this.userRepository = userRepository;
  }

  public static get(): UserRepository {
    if (!this.userRepository) {
      throw new UserRepositoryNotRegisteredException();
    }
    return this.userRepository;
  }
}
