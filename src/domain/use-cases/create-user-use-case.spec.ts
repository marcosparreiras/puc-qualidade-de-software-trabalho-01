import { EmailAlreadyRegisteredException } from "../exceptions/email-already-registered-exception";
import { GlobalPasswordEncoder } from "../utils/global-password-encoder";
import { FakePasswordEncoder } from "../utils/test/fake-password-encoder";
import { FakeUserFactory } from "../utils/test/fake-user-factory";
import { InMemoryUserRepository } from "../utils/test/in-memory-user-reposiotry";
import { CreateUserUseCase } from "./create-user-use-case";

describe("CreateUserUseCase - Domain Use Case", () => {
  let fakePasswordEncoder: FakePasswordEncoder;
  let inMemoryUserRepository: InMemoryUserRepository;
  let sut: CreateUserUseCase;

  beforeAll(() => {
    fakePasswordEncoder = new FakePasswordEncoder();
    GlobalPasswordEncoder.getInstance().config(fakePasswordEncoder);
  });

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new CreateUserUseCase(inMemoryUserRepository);
  });

  it("Should be able to create a new user", async () => {
    const name = "John Doe";
    const email = "johndoe@example.com";
    const password = "123456";

    const response = await sut.execute({
      name,
      email,
      password,
    });

    expect(response.user).toBeTruthy();
    expect(response.user.name).toEqual(name);
    expect(response.user.email).toEqual(email);

    const isPasswordCorrectlyHashed = fakePasswordEncoder.compare(
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
    const someRegisteredUser = FakeUserFactory.makeOne({ email });
    inMemoryUserRepository.items.push(someRegisteredUser);

    const name = "John Doe";
    const password = "123456";

    await expect(() =>
      sut.execute({
        name,
        email,
        password,
      })
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredException);

    expect(inMemoryUserRepository.items).toHaveLength(1);
  });
});
