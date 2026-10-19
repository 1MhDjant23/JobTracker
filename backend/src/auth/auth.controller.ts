import {
  Controller,
  Post,
  Body,
  Headers,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ApiResponse } from '../../../packages/contracts/src/common';
import type {
  LoginControllerResult,
  RefreshStrategyResult,
} from './auth.types';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshGuard } from './guards/jwt-refresh-guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

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

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<ApiResponse<null>> {
    await this.authService.register(dto);
    return {
      data: null,
    };
  }

  @Post('logout')
  @UseGuards(JwtRefreshGuard)
  async logout(
    @CurrentUser('refreshId') refreshId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<null>> {
    await this.authService.logout(refreshId);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.confgService.getOrThrow<string>('MODE') === 'PROD',
      path: '/',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      data: null,
    };
  }
}
