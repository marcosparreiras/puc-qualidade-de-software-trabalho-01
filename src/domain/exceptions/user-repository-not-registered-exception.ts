import { DomainException } from "./domain-exception";

export class UserRepositoryNotRegisteredException extends DomainException {
  constructor() {
    super("User respository not registered", 500);
  }
}
