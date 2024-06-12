import { EmailAlreadyRegisteredException } from "../exceptions/email-already-registered-exception";
import { GlobalPasswordEncoder } from "../proxies/global-password-encoder";
import { UserRepositoryRegistry } from "../registry/user-repository-registry";
import { FakePasswordEncoder } from "../test-utils/fake-password-encoder";
import { FakeUserFactory } from "../test-utils/fake-user-factory";
import { InMemoryUserRepository } from "../test-utils/in-memory-user-reposiotry";
import { CreateUserUseCase } from "./create-user-use-case";

describe("CreateUserUseCase - Domain Use Case", () => {
  let fakePasswordEncoder: FakePasswordEncoder;
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeAll(() => {
    fakePasswordEncoder = new FakePasswordEncoder();
    GlobalPasswordEncoder.getInstance().config(fakePasswordEncoder);
  });

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    UserRepositoryRegistry.set(inMemoryUserRepository);
  });

  it("Should be able to create a new user", async () => {
    const name = "John Doe";
    const email = "johndoe@example.com";
    const password = "123456";

    const response = await CreateUserUseCase.execute({
      name,
      email,
      password,
    });

    expect(response.user).toBeTruthy();
    expect(response.user.name).toEqual(name);
    expect(response.user.email).toEqual(email);

    const isPasswordCorrectlyHashed = await fakePasswordEncoder.compare(
      password,
      response.user.passwordHash
    );
    expect(isPasswordCorrectlyHashed).toBe(true);

    const userOnRepository = inMemoryUserRepository.items.find((item) =>
      item.compare(response.user)
    );
    expect(userOnRepository).toBeTruthy();
    expect(userOnRepository?.name).toEqual(name);
    expect(userOnRepository?.email).toEqual(email);
  });

  it("Should not be able to create with a duplicate email", async () => {
    const email = "johndoe@example.com";
    const someRegisteredUser = await FakeUserFactory.makeOne({ email });
    inMemoryUserRepository.items.push(someRegisteredUser);

    const name = "John Doe";
    const password = "123456";

    await expect(() =>
      CreateUserUseCase.execute({
        name,
        email,
        password,
      })
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredException);

    expect(inMemoryUserRepository.items).toHaveLength(1);
  });
});
