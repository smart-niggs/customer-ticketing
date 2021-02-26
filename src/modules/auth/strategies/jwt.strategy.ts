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
    const user = await this.userService.findOne(payload.sub);
    return {
      id: user.id,
      email: user.email,
      role_type: user.role_type,
      scopes: user.role.scopes
    };
  }
}
