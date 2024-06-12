import { randomUUID } from "node:crypto";
import { FakeDomainEntityImp } from "../../test-utils/fake-domain-entity-imp";

describe("DomainEntity - Domain Layer Super Type", () => {
  it("Should be able to create a new domain-entity", () => {
    const domainEntity = new FakeDomainEntityImp();
    expect(domainEntity.id).not.toBeFalsy();
  });

  it("Should be able to laod domain-entity", () => {
    const id = randomUUID().toString();
    const domainEntity = new FakeDomainEntityImp(id);
    expect(domainEntity.id).toEqual(id);
  });

  it("Should be able to compare domain-entities", () => {
    const domainEntity01 = new FakeDomainEntityImp();
    const domainEntity02 = new FakeDomainEntityImp();
    const domainEntity01Loaded = new FakeDomainEntityImp(domainEntity01.id);

    expect(domainEntity01.compare(domainEntity01Loaded)).toBe(true);
    expect(domainEntity01.compare(domainEntity02)).toBe(false);
  });
});
