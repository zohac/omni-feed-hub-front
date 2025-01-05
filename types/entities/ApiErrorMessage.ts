export class ApiErrorMessage {
  constructor(
    public message: string[],
    public error: string,
    public statusCode: number
  ) {}
}
