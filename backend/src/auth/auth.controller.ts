import {
  Controller,
  Post,
  Body,
  Headers,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import {
  ApiResponse,
  User as PublicUser,
} from '../../../packages/contracts/src';
import type {
  AccessStrategyResult,
  LoginControllerResult,
  RefreshStrategyResult,
} from './auth.types';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshGuard } from './guards/jwt-refresh-guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAccessGuard } from './guards/jwt-access.guard';

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
      message: 'Logged in successfully',
    };
  }

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<ApiResponse<null>> {
    await this.authService.register(dto);
    return {
      data: null,
      message: 'User registered successfully. Please log in.',
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
      message: 'Logged out successfully',
    };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @CurrentUser() userPayload: RefreshStrategyResult,
    @Res({ passthrough: true }) res: Response,
    @Headers('User-Agent') userAgent: string | undefined,
  ): Promise<ApiResponse<{ accessToken: string }>> {
    const { accessToken, refreshToken } = await this.authService.refresh(
      userPayload,
      userAgent,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.confgService.getOrThrow<string>('MODE') === 'PROD',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      data: { accessToken: accessToken },
      message: 'Refreshed successfully',
    };
  }

  @Get('me')
  @UseGuards(JwtAccessGuard)
  async getMe(
    @CurrentUser() user: AccessStrategyResult,
  ): Promise<ApiResponse<PublicUser>> {
    return {
      data: await this.authService.getMe(user.sub),
      message: 'User retrieved successfully',
    };
  }
}
