import { UserNotFoundException } from "../exceptions/user-not-found-exception";
import { GlobalPasswordEncoder } from "../proxies/global-password-encoder";
import { FakePasswordEncoder } from "../test-utils/fake-password-encoder";
import { FakeUserFactory } from "../test-utils/fake-user-factory";
import { InMemoryUserRepository } from "../test-utils/in-memory-user-reposiotry";
import { DeleteUserUseCase } from "./delete-user-use-case";

describe("DeleteUserUseCase - Domain Use Case", () => {
  let fakePasswordEncoder: FakePasswordEncoder;
  let inMemoryUserRepository: InMemoryUserRepository;
  let sut: DeleteUserUseCase;

  beforeAll(() => {
    fakePasswordEncoder = new FakePasswordEncoder();
    GlobalPasswordEncoder.getInstance().config(fakePasswordEncoder);
  });

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new DeleteUserUseCase(inMemoryUserRepository);
  });

  it("Should be able to delete a user", async () => {
    const user = await FakeUserFactory.makeOne();
    inMemoryUserRepository.items.push(user);

    await sut.execute({ userId: user.id });

    expect(inMemoryUserRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete an unexistent user", async () => {
    await expect(() =>
      sut.execute({ userId: "unexistent-user-id" })
    ).rejects.toBeInstanceOf(UserNotFoundException);
  });
});
