import { Controller, Post, Body, Headers, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { ApiResponse } from '../../../packages/contracts/src/common';
import { LoginControllerResult } from './auth.types';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly confgService: ConfigService,
  ) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('User-Agent') userAgent: string | undefined,
  ): Promise<ApiResponse<LoginControllerResult>> {
    const { accessToken, refreshToken, user } = await this.authService.login({
      dto,
      userAgent,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.confgService.getOrThrow<string>('MODE') === 'PROD',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      data: {
        accessToken,
        user,
      },
    };
  }

  // @Post('register')
  // register(@Body() dto: RegisterDto) {
  //   return dto;
  // }
}
