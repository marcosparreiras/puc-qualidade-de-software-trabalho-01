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
    const EmailAlreadyRegistered = await this.userRepository.findByEmail(email);
    if (EmailAlreadyRegistered !== null) {
      throw new EmailAlreadyRegisteredException();
    }

    const user = UserEntity.create({ email, name, password });
    await this.userRepository.create(user);

    return { user };
  }
}
