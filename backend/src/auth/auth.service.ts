/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { toPublicUser } from 'src/user/mappers/user.mapper';
import { LoginServiceResult, TokenPair } from './auth.types';
import { User as PrismaUser } from 'generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly confgService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login({
    dto,
    userAgent,
  }: {
    dto: LoginDto;
    userAgent: string | undefined;
  }): Promise<LoginServiceResult> {
    const user = await this.findUserByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    try {
      await bcrypt.compare(dto.password, user.hashedPassword);
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { accessToken, refreshToken } = this.generateTokens({
      sub: user.id,
    });
    await this.storeRefreshToken(refreshToken, user.id, userAgent);
    return {
      user: toPublicUser(user),
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
  /** ********************************************** */
  generateTokens({ sub }: { sub: string }): TokenPair {
    const accessToken = this.jwtService.sign(
      { sub: sub, type: 'access' },
      {
        secret: this.confgService.getOrThrow<string>('ACCESS_SECRET'),
        expiresIn: Number(
          this.confgService.getOrThrow<number>('ACCESS_EXPIRATION'),
        ),
      },
    );
    const refreshToken = this.jwtService.sign(
      { sub: sub, type: 'refresh' },
      {
        secret: this.confgService.getOrThrow<string>('REFRESH_SECRET'),
        expiresIn: Number(
          this.confgService.getOrThrow<number>('REFRESH_EXPIRATION'),
        ),
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }
  async storeRefreshToken(
    refreshToken: string,
    userId: string,
    userAgent: string | undefined,
  ): Promise<void> {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.refreshToken.create({
      data: {
        userId: userId,
        hashedToken: hashedToken,
        userAgent: userAgent,
      },
    });
  }
  async findUserByUsername(username: string): Promise<PrismaUser | null> {
    return await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  }
}
