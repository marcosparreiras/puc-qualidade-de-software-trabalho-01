import { DomainException } from "./domain-exception";

export class UserNotFoundException extends DomainException {
  public constructor() {
    super("User not found", 404);
  }
}
