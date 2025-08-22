import {
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RefreshJwtGuard } from './guard/refresh-jwt-auth.guard';
import { ApiBody } from '@nestjs/swagger';
import { LoginDTO } from 'src/users/dto/create-user.dto';
import { RefreshJwtTokenDTO } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiBody({ type: LoginDTO })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request, @Res({ passthrough: true }) res) {
    try {
      const result = await this.authService.login(request.user, res);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
      );
    }
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() request) {
    try {
      const result = await this.authService.refreshToken(request.user);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
      );
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res) {
    return this.authService.logout(res);
  }
}
