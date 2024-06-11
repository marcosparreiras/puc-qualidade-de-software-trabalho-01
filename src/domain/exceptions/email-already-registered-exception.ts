import { DomainException } from "./domain-exception";

export class EmailAlreadyRegisteredException extends DomainException {
  public constructor() {
    super("Email alrady registered", 400);
  }
}
