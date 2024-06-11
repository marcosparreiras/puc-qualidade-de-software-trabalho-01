import { DomainEntity } from "../../entities/domain-entity";

export class FakeDomainEntityImp extends DomainEntity<null> {
  constructor(id?: string) {
    super(null, id);
  }
}
