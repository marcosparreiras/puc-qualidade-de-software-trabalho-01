import { DomainEntity } from "../entities/utils/domain-entity";

export class FakeDomainEntityImp extends DomainEntity<null> {
  constructor(id?: string) {
    super(null, id);
  }
}
