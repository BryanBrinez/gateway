import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class ExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    console.log('entroooo');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();

    // Si el error es un objeto con status y message, devolverlo como respuesta
    if (typeof rpcError === 'object' && rpcError !== null) {
      const status =
        'status' in rpcError && typeof (rpcError as any).status === 'number'
          ? rpcError.status
          : HttpStatus.INTERNAL_SERVER_ERROR;

      return response.status(status).json({
        statusCode: status,
        message: (rpcError as any).message || 'Internal server errorawdawda',
      });
    }

    // Si el error es un string u otro tipo, devolver un error genérico 500
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
