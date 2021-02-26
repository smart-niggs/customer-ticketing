import { Injectable } from '@nestjs/common';
const bcrypt = require('bcrypt');
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    // @Inject('USER_MODEL') private readonly userModel: Model<User>,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (user && await bcrypt.compare(pass, user.password)) {
        user.last_login_at = new Date();
        await user.save();

        const { id, email, firstname, lastname, last_login_at, role_type, role } = user;  // exclude mongoose document objects
        return { id, email, firstname, lastname, last_login_at, role_type };
      }
      return null;
    }
    catch (e) {
      // console.log('e: ' + e);
      return null;
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user
    };
  }

  async signUp(newUser: CreateUserDto) {
    const createdUser = await this.usersService.create(newUser);
    const { id, email,firstname, lastname, last_login_at, role_type } = createdUser;

    const accessToken = this.jwtService.sign({
      email: email,
      sub: id
    });

    return {
      accessToken,
      user: { id, email, firstname, lastname, last_login_at, role_type }
    };
  }
}
