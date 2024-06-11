import type { UserRepository } from "../bondaries/user-repository";
import type { UserEntity } from "../entities/user-entity";
import { UserNotFoundException } from "../exceptions/user-not-found-exception";

interface GetUserUseCaseRequest {
  userId: string;
}

interface GetUserUseCaseRespose {
  user: UserEntity;
}

export class GetUserUseCase {
  public constructor(private userRepository: UserRepository) {}

  public async execute({
    userId,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseRespose> {
    const user = await this.getUserById(userId);
    return { user };
  }

  private async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (user === null) {
      throw new UserNotFoundException();
    }
    return user;
  }
}
