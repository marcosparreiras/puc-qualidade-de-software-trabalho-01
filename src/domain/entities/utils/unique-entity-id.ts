import { randomUUID } from "node:crypto";

export class UniqueEntityId {
  private _value: string;

  public get value(): string {
    return this._value;
  }

  private constructor(value: string) {
    this._value = value;
  }

  public static generate() {
    const value = randomUUID();
    return new UniqueEntityId(value);
  }

  public static load(value: string) {
    return new UniqueEntityId(value);
  }

  public compare(another: UniqueEntityId): boolean {
    return this.value === another.value;
  }
}
