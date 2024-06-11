import type { UserRepository } from "../bondaries/user-repository";
import type { UserEntity } from "../entities/user-entity";

interface ListUsersUseCaseRequest {
  page: number;
}

interface ListUsersUseCaseResponse {
  users: UserEntity[];
}

export class ListUsersUseCase {
  public constructor(private userRepository: UserRepository) {}

  public async execute({
    page,
  }: ListUsersUseCaseRequest): Promise<ListUsersUseCaseResponse> {
    page = page < 1 ? 1 : page;
    const users: UserEntity[] = await this.userRepository.findMany(page);
    return { users };
  }
}
