import { EncoderNotRegisteredException } from "../exceptions/encoder-not-registered-exception";
import { GlobalPasswordEncoder } from "./global-password-encoder";
import { FakePasswordEncoder } from "./test/fake-password-encoder";

describe("GlobalPasswordEncoder - Domain Util", () => {
  let fakePasswordEncoder = new FakePasswordEncoder();

  beforeAll(() => {
    fakePasswordEncoder = new FakePasswordEncoder();
  });

  beforeEach(() => {
    GlobalPasswordEncoder.getInstance().config(null);
  });

  it("Should be able a singleton", () => {
    const globalPasswordEncoder = GlobalPasswordEncoder.getInstance();
    const globalPasswordEncoder2 = GlobalPasswordEncoder.getInstance();
    expect(globalPasswordEncoder).toBe(globalPasswordEncoder2);
  });

  it("should be a virtual proxy for a password-encoder implementation", async () => {
    const globalPasswordEncoder = GlobalPasswordEncoder.getInstance();
    globalPasswordEncoder.config(fakePasswordEncoder);

    const plainTextPassword = "123456";
    const passwordHash = await fakePasswordEncoder.hash(plainTextPassword);

    const isHashEquals =
      (await globalPasswordEncoder.hash(plainTextPassword)) ===
      (await fakePasswordEncoder.hash(plainTextPassword));
    const isCompareEquals =
      (await globalPasswordEncoder.compare(plainTextPassword, passwordHash)) ===
      (await fakePasswordEncoder.compare(plainTextPassword, passwordHash));

    expect(isHashEquals).toBe(true);
    expect(isCompareEquals).toBe(true);
  });

  it("Should trhow an error when the encoder is not setup", async () => {
    const globalPasswordEncoder = GlobalPasswordEncoder.getInstance();

    await expect(() =>
      globalPasswordEncoder.hash("123456")
    ).rejects.toBeInstanceOf(EncoderNotRegisteredException);

    await expect(() =>
      globalPasswordEncoder.compare("123456", "123456-hashed")
    ).rejects.toBeInstanceOf(EncoderNotRegisteredException);
  });
});
