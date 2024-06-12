import { UserNotFoundException } from "../exceptions/user-not-found-exception";
import { PasswordEncoderRegistry } from "../registry/password-encoder-registry";
import { UserRepositoryRegistry } from "../registry/user-repository-registry";
import { FakePasswordEncoder } from "../test-utils/fake-password-encoder";
import { FakeUserFactory } from "../test-utils/fake-user-factory";
import { InMemoryUserRepository } from "../test-utils/in-memory-user-reposiotry";
import { GetUserUseCase } from "./get-user-use-case";

describe("GetUserUseCase - Domain Use Case", () => {
  let fakePasswordEncoder: FakePasswordEncoder;
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeAll(() => {
    fakePasswordEncoder = new FakePasswordEncoder();
    PasswordEncoderRegistry.set(fakePasswordEncoder);
  });

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    UserRepositoryRegistry.set(inMemoryUserRepository);
  });

  it("Should be able to get a user by id", async () => {
    const someRegisteredUser = await FakeUserFactory.makeOne();
    inMemoryUserRepository.items.push(someRegisteredUser);

    const response = await GetUserUseCase.execute({
      userId: someRegisteredUser.id,
    });

    expect(response.user).toBeTruthy();
    expect(response.user.compare(someRegisteredUser)).toBe(true);
    expect(response.user.name).toBe(someRegisteredUser.name);
    expect(response.user.email).toBe(someRegisteredUser.email);
  });

  it("Should not be able to get an unexistent user", async () => {
    await expect(() =>
      GetUserUseCase.execute({ userId: "some-unexistent-id" })
    ).rejects.toBeInstanceOf(UserNotFoundException);
  });
});
