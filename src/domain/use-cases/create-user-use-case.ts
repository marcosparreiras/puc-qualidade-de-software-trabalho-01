import { UserEntity } from "../entities/user-entity";
import { EmailAlreadyRegisteredException } from "../exceptions/email-already-registered-exception";
import { UserRepositoryRegistry } from "../registry/user-repository-registry";

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface CreateUserUseCaseResponse {
  user: UserEntity;
}

export class CreateUserUseCase {
  public static async execute({
    email,
    name,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    await this.assertEmailIsAvailable(email);
    const user = await UserEntity.create({ email, name, password });
    await UserRepositoryRegistry.get().create(user);
    return { user };
  }

  private static async assertEmailIsAvailable(email: string): Promise<void> {
    const EmailAlreadyRegistered =
      await UserRepositoryRegistry.get().existsByEmail(email);
    if (EmailAlreadyRegistered) {
      throw new EmailAlreadyRegisteredException();
    }
  }
}
