import { randomUUID } from "node:crypto";
import { UniqueEntityId } from "./unique-entity-id";

describe("UniqueEntityId", () => {
  it("Should be able to generate a unique-entity-id", () => {
    const entityId = UniqueEntityId.generate();
    expect(entityId.value).not.toBeNull();
  });

  it("Should be able to load an reference of unique-entity-id", () => {
    const idRef = randomUUID().toString();
    const entityId = UniqueEntityId.load(idRef);
    expect(entityId.value).toBe(idRef);
  });

  it("Should be able to compare unique-entity-ids", () => {
    const entityId01 = UniqueEntityId.generate();
    const entityId02 = UniqueEntityId.generate();
    const entityIdRef01 = UniqueEntityId.load(entityId01.value);

    expect(entityId01.compare(entityId02)).toBe(false);
    expect(entityId01.compare(entityIdRef01)).toBe(true);
  });
});
