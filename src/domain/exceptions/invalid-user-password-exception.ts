import { DomainException } from "./domain-exception";

export class InvalidUserPassword extends DomainException {
  public constructor() {
    super("Invalid user password", 401);
  }
}
