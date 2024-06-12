import type { UserEntity } from "../entities/user-entity";
import { UserNotFoundException } from "../exceptions/user-not-found-exception";
import { UserRepositoryRegistry } from "../registry/user-repository-registry";

interface GetUserUseCaseRequest {
  userId: string;
}

interface GetUserUseCaseRespose {
  user: UserEntity;
}

export class GetUserUseCase {
  public static async execute({
    userId,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseRespose> {
    const user = await this.getUserById(userId);
    return { user };
  }

  private static async getUserById(id: string): Promise<UserEntity> {
    const user = await UserRepositoryRegistry.get().findById(id);
    if (user === null) {
      throw new UserNotFoundException();
    }
    return user;
  }
}
