import { DomainException } from "./domain-exception";

export class EncoderNotRegisteredException extends DomainException {
  constructor() {
    super("Encoder not registered", 500);
  }
}
