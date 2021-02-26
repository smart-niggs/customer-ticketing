import { SetMetadata } from '@nestjs/common';
import { RoleScopes } from 'src/common/constants';

export const Roles = (...scopes: RoleScopes[]) => SetMetadata('scopes', scopes);
