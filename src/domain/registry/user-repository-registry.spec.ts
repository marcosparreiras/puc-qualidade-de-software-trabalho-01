import { UserRepositoryNotRegisteredException } from "../exceptions/user-repository-not-registered-exception";
import { InMemoryUserRepository } from "../test-utils/in-memory-user-reposiotry";
import { UserRepositoryRegistry } from "./user-repository-registry";

describe("UserRepositoryRegistry - Domain Registry", () => {
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeAll(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
  });

  beforeEach(() => {
    UserRepositoryRegistry.set(null);
  });

  it("Should be configured before usage", () => {
    expect(() => UserRepositoryRegistry.get()).toThrowError(
      UserRepositoryNotRegisteredException
    );
  });

  it("Should be able to retrieve a registered user-respoitory", () => {
    UserRepositoryRegistry.set(inMemoryUserRepository);
    const userRepository = UserRepositoryRegistry.get();
    expect(userRepository).toBe(inMemoryUserRepository);
  });
});
