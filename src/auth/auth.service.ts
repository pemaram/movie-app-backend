import { Injectable } from '@nestjs/common';
import { PrismaConnectionService } from 'src/prisma-connection/prisma-connection.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaConnection: PrismaConnectionService,
    private jwtService: JwtService,
  ) { }

  async checkUserExists(email: string, password: string) {
    const checkUserExists = await this.prismaConnection.users.findUnique({
      where: { email: email },
    });

    const isMatchedPwd = await bcrypt.compare(
      password,
      checkUserExists.password,
    );

    if (checkUserExists && isMatchedPwd) {
      const { password, ...result } = checkUserExists;
      console.log(password);
      return result;
    }

    return {
      status: false,
      message: 'Users not found',
      data: null,
    };
  }

  async login(request: any, res: Response) {
    const payload = {
      username: request.email,
      sub: {
        status: request.status,
      },
    };

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const data = {
      ...request,
      accessToken: this.jwtService.sign(payload),
    };

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    return {
      status: true,
      data: data,
      message: 'Logged In successfully',
    };
  }

  async refreshToken(request: any) {
    const payload = {
      username: request.email,
      sub: {
        status: request.status,
      },
    };

    const data = {
      accessToken: this.jwtService.sign(payload),
    };

    return {
      status: true,
      data: data,
      message: 'Token generated successfully',
    };
  }

  async logout(res: Response) {
    res.clearCookie('refreshToken', { path: '/auth/refresh' });
    return { status: true, message: 'Logged out' };
  }
}
