import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

type params = 'id' | 'email' | 'role_type';

export const UserDecorator = createParamDecorator(
  (data: params, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    try {
      if (data) {
        if (request.user[data])
          return request.user[data];
        throw new InternalServerErrorException('user info not attached after authentication');
      }
      return request.user;
    }
    catch {
      throw new InternalServerErrorException('user info not attached after authentication');
    }
  },
);
