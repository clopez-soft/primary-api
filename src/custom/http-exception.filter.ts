import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {}

  async catch(exception: any, host: ArgumentsHost) {
    console.log("🚀 > AllExceptionsFilter > exception", exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const timestamp = new Date().toISOString();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const msg = exception?.message;

    let msgResponse = "TECHNICAL_ERROR";
    switch (status) {
      case HttpStatus.CONFLICT:
        msgResponse = msg;
        break;
      case HttpStatus.PRECONDITION_FAILED:
        msgResponse = exception?.response?.message?.join(", ") || msgResponse;
        break;
      case HttpStatus.UNAUTHORIZED:
        msgResponse = exception?.response?.message?.join(", ") || msgResponse;
        break;
      default:
        msgResponse = exception?.response?.message?.join(", ") || msgResponse;
    }

    response.status(status).json({
      message: msgResponse,
      statusCode: status,
      timestamp: timestamp,
      path: request.url,
    });
  }
}
