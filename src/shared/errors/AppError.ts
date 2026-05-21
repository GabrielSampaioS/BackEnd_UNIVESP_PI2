export class AppError extends Error {

  constructor(
    message: string,
    public statusCode: number,
    public type: string
  ) {
    super(message);
  }

}