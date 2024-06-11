import { UniqueEntityId } from "../utils/unique-entity-id";

export abstract class DomainEntity<Props> {
  private _id: UniqueEntityId;
  protected props: Props;

  public get id(): string {
    return this._id.value;
  }

  public compare(another: DomainEntity<unknown>): boolean {
    return this._id.compare(another._id);
  }

  protected constructor(props: Props, id?: string) {
    this._id = id ? UniqueEntityId.load(id) : UniqueEntityId.generate();
    this.props = props;
  }
}
