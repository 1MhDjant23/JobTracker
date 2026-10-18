/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { toPublicUser } from 'src/user/mappers/user.mapper';
import { LoginServiceResult, TokenPair, UserWithToken } from './auth.types';
import { User as PrismaUser, RefreshToken } from 'generated/prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly confgService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  /** Login Logic */
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
  /** Register Logic */
  async register(dto: RegisterDto) {
    let exist = await this.findUserByUsername(dto.username);
    if (exist) {
      throw new ConflictException(
        'username already taken, please enter different username',
      );
    }
    exist = await this.findUserByEmail(dto.email);
    if (exist) {
      throw new ConflictException(
        'email already taken, please enter different email',
      );
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.userService.create({
      username: dto.username,
      email: dto.email,
      hashedPassword: hashedPassword,
    });
  }
  /** Logout Logic */
  async logout(refreshToken: string) {}
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
  async findUserByIdWithToken(userId: string): Promise<UserWithToken | null> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      include: { refreshTokens: true },
    });
  }
  async findUserByUsername(username: string): Promise<PrismaUser | null> {
    return await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  }
  async findUserByEmail(email: string): Promise<PrismaUser | null> {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
