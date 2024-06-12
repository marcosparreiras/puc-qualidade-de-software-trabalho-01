import type { UserEntity } from "../entities/user-entity";
import { UserNotFoundException } from "../exceptions/user-not-found-exception";
import { UserRepositoryRegistry } from "../registry/user-repository-registry";

interface DeleteUserUseCaseRequest {
  userId: string;
}

export class DeleteUserUseCase {
  public static async execute({
    userId,
  }: DeleteUserUseCaseRequest): Promise<void> {
    const user = await this.getUserById(userId);
    await UserRepositoryRegistry.get().delete(user);
    return;
  }

  private static async getUserById(id: string): Promise<UserEntity> {
    const user = await UserRepositoryRegistry.get().findById(id);
    if (user === null) {
      throw new UserNotFoundException();
    }
    return user;
  }
}
