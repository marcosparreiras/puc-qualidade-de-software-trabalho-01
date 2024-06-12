import type { UserEntity } from "../entities/user-entity";
import { PasswordEncoderRegistry } from "../registry/password-encoder-registry";
import { UserRepositoryRegistry } from "../registry/user-repository-registry";
import { FakePasswordEncoder } from "../test-utils/fake-password-encoder";
import { FakeUserFactory } from "../test-utils/fake-user-factory";
import { InMemoryUserRepository } from "../test-utils/in-memory-user-reposiotry";
import { ListUsersUseCase } from "./list-users-use-case";

describe("ListUsersUseCase - Domain Use Case", () => {
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeAll(() => {
    const fakePasswordEncoder = new FakePasswordEncoder();
    PasswordEncoderRegistry.set(fakePasswordEncoder);
  });

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    UserRepositoryRegistry.set(inMemoryUserRepository);
  });

  it("Should be able to get a list of users", async () => {
    const usersNumber = 10;
    const users: UserEntity[] = await FakeUserFactory.makeMany(usersNumber);
    inMemoryUserRepository.items.push(...users);

    const response = await ListUsersUseCase.execute({ page: 1 });
    expect(response.users).toHaveLength(usersNumber);
  });

  it("Should be able to paginate the users list result", async () => {
    const usersNumber = 33;
    const users: UserEntity[] = await FakeUserFactory.makeMany(usersNumber);
    inMemoryUserRepository.items.push(...users);

    const [responseP1, responseP2] = await Promise.all([
      ListUsersUseCase.execute({ page: 1 }),
      ListUsersUseCase.execute({ page: 2 }),
    ]);

    expect(responseP1.users).toHaveLength(inMemoryUserRepository.pageSize);
    expect(responseP2.users).toHaveLength(
      usersNumber - 1 * inMemoryUserRepository.pageSize
    );
  });

  it("Should be able to retrieve the first page with the page parameter is less the 1 ", async () => {
    const usersNumber = 7;
    const users: UserEntity[] = await FakeUserFactory.makeMany(usersNumber);
    inMemoryUserRepository.items.push(...users);

    const [responseP0, responsePN5] = await Promise.all([
      ListUsersUseCase.execute({ page: 0 }),
      ListUsersUseCase.execute({ page: -5 }),
    ]);

    expect(responseP0.users).toHaveLength(usersNumber);
    expect(responsePN5.users).toHaveLength(usersNumber);
  });
});
