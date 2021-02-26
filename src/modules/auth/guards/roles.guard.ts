import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERROR_MESSAGES } from 'src/common/constants';
// import { ERROR_MESSAGES } from '../constants';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const scopes = this.reflector.get<string[]>('scopes', context.getHandler());
    // console.log('scopes: ' + (scopes));

    // scope not provided, i.e auth not required for endpoint
    if (!scopes)
      return true;

    const { user } = context.switchToHttp().getRequest();

    if (!(user && user.scopes))
      throw new UnauthorizedException(ERROR_MESSAGES.Unauthorized);

    const userScopes: string[] = user.scopes;

    if (this.matchRoles(userScopes, scopes))
      return true;

    throw new UnauthorizedException(ERROR_MESSAGES.Unauthorized);
  }


  private matchRoles(userScopes: string[], scopes: string[]): boolean {
    return scopes.every(item => userScopes.includes(item));
  }
}
