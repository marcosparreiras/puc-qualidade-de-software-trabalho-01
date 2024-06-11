export abstract class DomainException extends Error {
  private _errorCode: number;

  get errorCode(): number {
    return this._errorCode;
  }

  protected constructor(message: string, errorCode: number) {
    super(message);
    this._errorCode = errorCode;
  }
}
