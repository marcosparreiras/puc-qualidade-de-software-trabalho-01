import { EmailAlreadyRegisteredException } from "../exceptions/email-already-registered-exception";
import { UserNotFoundException } from "../exceptions/user-not-found-exception";
import { GlobalPasswordEncoder } from "../proxies/global-password-encoder";
import { FakePasswordEncoder } from "../test-utils/fake-password-encoder";
import { FakeUserFactory } from "../test-utils/fake-user-factory";
import { InMemoryUserRepository } from "../test-utils/in-memory-user-reposiotry";
import { UpdateUserUseCase } from "./update-user-user-case";
import { InvalidUserPasswordExecption } from "../exceptions/invalid-user-password-exception";

describe("UpdateUserUseCase - Domain Use Case", () => {
  let fakePasswordEncoder: FakePasswordEncoder;
  let inMemoryUserRepository: InMemoryUserRepository;
  let sut: UpdateUserUseCase;

  beforeAll(() => {
    fakePasswordEncoder = new FakePasswordEncoder();
    GlobalPasswordEncoder.getInstance().config(fakePasswordEncoder);
  });

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new UpdateUserUseCase(inMemoryUserRepository);
  });

  it("Should be able to update a user data", async () => {
    const oldPassword = "123456";
    const someRegisteredUser = await FakeUserFactory.makeOne({
      password: oldPassword,
    });
    inMemoryUserRepository.items.push(someRegisteredUser);

    const email = "johdoe@example.com";
    const name = "John Doe";
    const newPassword = "654321";

    const response = await sut.execute({
      userId: someRegisteredUser.id,
      email,
      name,
      oldPassword,
      newPassword,
    });

    expect(response.user).toBeTruthy();
    expect(response.user.name).toEqual(name);
    expect(response.user.email).toEqual(email);

    const isPasswordUpdated = await fakePasswordEncoder.compare(
      newPassword,
      response.user.passwordHash
    );
    expect(isPasswordUpdated).toBe(true);

    const updatedUserOnRepository = inMemoryUserRepository.items.find((item) =>
      item.compare(response.user)
    );
    expect(inMemoryUserRepository.items).toHaveLength(1);
    expect(updatedUserOnRepository).toBeTruthy();
    expect(updatedUserOnRepository?.name).toEqual(name);
    expect(updatedUserOnRepository?.email).toEqual(email);
  });

  it("Should not be able to update an unexistent user", async () => {
    const email = "johdoe@example.com";
    const name = "John Doe";
    const oldPassword = "123456";
    const newPassword = "654321";
    await expect(() =>
      sut.execute({
        userId: "some-unexistent-user-id",
        email,
        name,
        oldPassword,
        newPassword,
      })
    ).rejects.toBeInstanceOf(UserNotFoundException);
  });

  it("Should be able to update a user and keep his email", async () => {
    const email = "johdoe@example.com";
    const oldPassword = "123456";

    const user01 = await FakeUserFactory.makeOne({
      email,
      password: oldPassword,
    });

    inMemoryUserRepository.items.push(user01);

    const name = "John Doe";
    const newPassword = "654321";

    const response = await sut.execute({
      userId: user01.id,
      email,
      name,
      oldPassword,
      newPassword,
    });

    expect(response.user).toBeTruthy();
  });

  it("Should not be able to update a user email with an already registered email", async () => {
    const email = "johdoe@example.com";
    const oldPassword = "123456";

    const [user01, user02] = await Promise.all([
      FakeUserFactory.makeOne({ email }),
      FakeUserFactory.makeOne({ password: oldPassword }),
    ]);

    inMemoryUserRepository.items.push(user01, user02);

    const name = "John Doe";
    const newPassword = "654321";

    await expect(() =>
      sut.execute({
        userId: user02.id,
        email,
        name,
        oldPassword,
        newPassword,
      })
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredException);
  });

  it("Should not be able to update a user with incorrect credentials", async () => {
    const oldPassword = "123456";

    const user01 = await FakeUserFactory.makeOne({ password: oldPassword });

    inMemoryUserRepository.items.push(user01);

    const name = "John Doe";
    const email = "johdoe@example.com";
    const newPassword = "654321";

    await expect(() =>
      sut.execute({
        userId: user01.id,
        email,
        name,
        oldPassword: "some-invalid-Password",
        newPassword,
      })
    ).rejects.toBeInstanceOf(InvalidUserPasswordExecption);
  });
});
