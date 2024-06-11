import { DomainException } from "./domain-exception";

export class InvalidUserPasswordExecption extends DomainException {
  public constructor() {
    super("Invalid user password", 401);
  }
}
