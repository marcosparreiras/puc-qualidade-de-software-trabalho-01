import type { UserRepository } from "../bondaries/user-repository";
import type { UserEntity } from "../entities/user-entity";
import { UserNotFoundException } from "../exceptions/user-not-found-exception";

interface DeleteUserUseCaseRequest {
  userId: string;
}

export class DeleteUserUseCase {
  public constructor(private userRepository: UserRepository) {}

  public async execute({ userId }: DeleteUserUseCaseRequest): Promise<void> {
    const user = await this.getUserById(userId);
    await this.userRepository.delete(user);
    return;
  }

  private async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (user === null) {
      throw new UserNotFoundException();
    }
    return user;
  }
}
