import type { UserEntity } from "../entities/user-entity";
import { UserRepositoryRegistry } from "../registry/user-repository-registry";

interface ListUsersUseCaseRequest {
  page: number;
}

interface ListUsersUseCaseResponse {
  users: UserEntity[];
}

export class ListUsersUseCase {
  public static async execute({
    page,
  }: ListUsersUseCaseRequest): Promise<ListUsersUseCaseResponse> {
    page = page < 1 ? 1 : page;
    const users: UserEntity[] = await UserRepositoryRegistry.get().findMany(
      page
    );
    return { users };
  }
}
