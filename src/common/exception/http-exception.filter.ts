import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { ERROR_MESSAGES } from '../constants';


@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error: Error[] = [];

    console.log('exception: ' + exception);
    
    // HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      error = this.extractHttpExceptionObject(exception);
    }

    // Mongo Duplicate Error
    else if (exception.name == 'MongoError' && exception.code == '11000') {
      status = HttpStatus.BAD_REQUEST;
      error = [{
        // message: `record already exists for: ${Object.keys(exception.keyValue)}`,
        message: `duplicate record: ${JSON.stringify(exception.keyValue)}`,
        type: 'duplicate record'
      }];
    }

    // // MoongoseError
    // else if (exception instanceof mongoose.Error) {
    //   status = HttpStatus.BAD_REQUEST;
    //   error = this.extractMongooseError(exception);
    // }

    // default to Internal Server Error
    else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      error = [{
        message: exception.toString()
      }]
    }

    response.status(status).json({
      statusCode: 0,
      error
    });
  }


  // private methods
  private extractHttpExceptionObject(exception: HttpException): Error[] {
    let message;
    let messageType;
    let error = [];

    try {
      const response = exception.getResponse();
      message = response['message'];
      messageType = typeof (message);

      // *class-validator* error returns a string as HttpException
      if (Array.isArray(message)) {
        error = message.map(errorText => ({ message: errorText }));
      }

      // typical errors thrown
      if (messageType === 'string')
        error.push({ message });
    }
    catch (e) {
      // console.log('e: ' + JSON.stringify(e));
      error.push({ message: ERROR_MESSAGES.InternalServerError });
    }
    finally {
      return error;
    }
  }

  private extractMongooseError(exception: mongoose.Error): Error[] {
    // const { message, name, stack } = exception;
      return [{ ...exception }];
  }
}

class Error {
  message: string;
  type?: string;
  name?: string;
  stack?: string;
}
