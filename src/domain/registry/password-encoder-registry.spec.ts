import { EncoderNotRegisteredException } from "../exceptions/encoder-not-registered-exception";
import { FakePasswordEncoder } from "../test-utils/fake-password-encoder";
import { PasswordEncoderRegistry } from "./password-encoder-registry";

describe("PasswordEncoderRegistry - Domain Registry", () => {
  let fakePasswordEncoder: FakePasswordEncoder;

  beforeAll(() => {
    fakePasswordEncoder = new FakePasswordEncoder();
  });

  beforeEach(() => {
    PasswordEncoderRegistry.set(null);
  });

  it("Should be configured before usage", () => {
    expect(() => PasswordEncoderRegistry.get()).toThrowError(
      EncoderNotRegisteredException
    );
  });

  it("Should be able to retrieve a registered user-respoitory", () => {
    PasswordEncoderRegistry.set(fakePasswordEncoder);
    const passwordEncoder = PasswordEncoderRegistry.get();
    expect(passwordEncoder).toBe(fakePasswordEncoder);
  });
});
