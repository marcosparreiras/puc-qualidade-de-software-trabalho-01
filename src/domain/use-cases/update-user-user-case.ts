import type { UserRepository } from "../bondaries/user-repository";
import type { UserEntity } from "../entities/user-entity";
import { EmailAlreadyRegisteredException } from "../exceptions/email-already-registered-exception";
import { UserNotFoundException } from "../exceptions/user-not-found-exception";

interface UpdateUserUseCaseRequest {
  userId: string;
  name: string;
  email: string;
  oldPassword: string;
  newPassword: string;
}

interface UpdateUserUseCaseResponse {
  user: UserEntity;
}

export class UpdateUserUseCase {
  public constructor(private userRepository: UserRepository) {}

  public async execute({
    userId,
    name,
    email,
    oldPassword,
    newPassword,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const user = await this.getUserById(userId);
    await this.checkUserNewEmailAvailability(user, email);

    user.chagePassword(oldPassword, newPassword);
    user.name = name;
    user.email = email;

    await this.userRepository.save(user);
    return { user };
  }

  private async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (user === null) {
      throw new UserNotFoundException();
    }
    return user;
  }

  private async checkUserNewEmailAvailability(
    user: UserEntity,
    email: string
  ): Promise<void> {
    const emailChanged = user.email !== email;
    if (!emailChanged) {
      return;
    }
    await this.assertEmailIsAvailable(email);
  }

  private async assertEmailIsAvailable(email: string): Promise<void> {
    const EmailAlreadyRegistered = await this.userRepository.existsByEmail(
      email
    );
    if (EmailAlreadyRegistered) {
      throw new EmailAlreadyRegisteredException();
    }
  }
}
