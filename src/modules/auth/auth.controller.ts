import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiHeaders, ApiTags } from '@nestjs/swagger';
import { USER_HEADERS } from 'src/common/constants';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';


@Controller('auth')
@ApiTags('Auth')
@ApiHeaders(USER_HEADERS)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req
  ) {
    return this.authService.login(req.user);
  }

  @Post('sign-up')
  async signUp(@Body() newUser: CreateUserDto) {
    return this.authService.signUp(newUser);
  }
}
