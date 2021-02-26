import { Mongoose } from 'mongoose';
import { DATABASE_CONNECTION } from 'src/common/constants';
import { ROLES_MODEL, USER_MODEL } from './constants';
import { RoleSchema } from './schemas/role.schema';
import { UserSchema } from './schemas/user.schema';

export const UserProviders = [
  {
    provide: USER_MODEL,
    useFactory: (mongoose: Mongoose) => mongoose.model('User', UserSchema),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: ROLES_MODEL,
    useFactory: (mongoose: Mongoose) => mongoose.model('Role', RoleSchema),
    inject: [DATABASE_CONNECTION],
  },
];
