import type { UserRepository } from "../bondaries/user-repository";
import { UserEntity } from "../entities/user-entity";
import { EmailAlreadyRegisteredException } from "../exceptions/email-already-registered-exception";

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface CreateUserUseCaseResponse {
  user: UserEntity;
}

export class CreateUserUseCase {
  public constructor(private userRepository: UserRepository) {}

  public async execute({
    email,
    name,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    await this.assertEmailIsAvailable(email);
    const user = UserEntity.create({ email, name, password });
    await this.userRepository.create(user);
    return { user };
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
