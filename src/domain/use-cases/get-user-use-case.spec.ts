import { UserNotFoundException } from "../exceptions/user-not-found-exception";
import { GlobalPasswordEncoder } from "../utils/global-password-encoder";
import { FakePasswordEncoder } from "../utils/test/fake-password-encoder";
import { FakeUserFactory } from "../utils/test/fake-user-factory";
import { InMemoryUserRepository } from "../utils/test/in-memory-user-reposiotry";
import { GetUserUseCase } from "./get-user-use-case";

describe("GetUserUseCase - Domain Use Case", () => {
  let fakePasswordEncoder: FakePasswordEncoder;
  let inMemoryUserRepository: InMemoryUserRepository;
  let sut: GetUserUseCase;

  beforeAll(() => {
    fakePasswordEncoder = new FakePasswordEncoder();
    GlobalPasswordEncoder.getInstance().config(fakePasswordEncoder);
  });

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new GetUserUseCase(inMemoryUserRepository);
  });

  it("Should be able to get a user by id", async () => {
    const someRegisteredUser = FakeUserFactory.makeOne();
    inMemoryUserRepository.items.push(someRegisteredUser);

    const response = await sut.execute({ userId: someRegisteredUser.id });

    expect(response.user).toBeTruthy();
    expect(response.user.compare(someRegisteredUser)).toBe(true);
    expect(response.user.name).toBe(someRegisteredUser.name);
    expect(response.user.email).toBe(someRegisteredUser.email);
  });

  it("Should not be able to get an unexistent user", async () => {
    await expect(() =>
      sut.execute({ userId: "some-unexistent-id" })
    ).rejects.toBeInstanceOf(UserNotFoundException);
  });
});