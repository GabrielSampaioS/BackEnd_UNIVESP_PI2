export class AppError extends Error {

  public readonly statusCode: number
  public readonly typeError: string

  constructor(
    message: string,
    statusCode: number,
    typeError: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.typeError = typeError;
  }

}