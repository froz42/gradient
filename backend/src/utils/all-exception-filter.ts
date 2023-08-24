import { Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch()
export class AllExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown) {
    return exception;
  }
}
