import { BcryptPasswordEncoder } from "./bcrypt-password-encoder";

describe("BcryptPasswordEncoder - Adapter", () => {
  let bcryptPasswordEncoder: BcryptPasswordEncoder;

  beforeAll(() => {
    bcryptPasswordEncoder = new BcryptPasswordEncoder();
  });

  it("Should be able to genrate a hash of a plain text", async () => {
    const plainText = "123456";
    const hash = await bcryptPasswordEncoder.hash(plainText);

    expect(hash).not.toEqual(plainText);
    expect(hash).toBeTruthy();
  });

  it("Should be able to validate its hash with te correct password", async () => {
    const plainText = "123456";
    const hash = await bcryptPasswordEncoder.hash(plainText);
    const isPasswordValid = await bcryptPasswordEncoder.compare(
      plainText,
      hash
    );
    expect(isPasswordValid).toBe(true);
  });

  it("Should be able to invalidate its hash with te wrong password", async () => {
    const plainText = "123456";
    const hash = await bcryptPasswordEncoder.hash(plainText);
    const isPasswordValid = await bcryptPasswordEncoder.compare(
      "some-wrong-password",
      hash
    );
    expect(isPasswordValid).toBe(false);
  });
});
