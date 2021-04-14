import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configService } from 'src/common/config/config.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getJwtSecret()
    });
  }

  async validate(payload: any) {
    console.log('payload: ' + JSON.stringify(payload));
    const user = await this.userService.findOne(payload.sub);
    console.log('user: ' + JSON.stringify(user));
    return {
      id: user._id,
      email: user.email,
      role_type: user.role_type,
      scopes: user.role.scopes
    };
  }
}
