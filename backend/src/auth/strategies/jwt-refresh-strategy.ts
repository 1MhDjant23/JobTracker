import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { RefreshStrategyResult } from '../auth.types';

export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly confgService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: confgService.getOrThrow<string>('REFRESH_SECRET'),
      ignoreExpiration: false,
    });
  }
  async validate(
    req: Request,
    payload: { sub: string; type: string },
  ): Promise<RefreshStrategyResult> {
    const refreshToken = req.cookies.refreshToken as string;
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const userWithToken = await this.authService.findUserByIdWithToken(
      payload.sub,
    );
    if (!userWithToken || userWithToken.refreshTokens.length === 0) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    let matchedToken;
    for (const token of userWithToken.refreshTokens) {
      const isMatch = await bcrypt.compare(refreshToken, token.hashedToken);
      if (isMatch) {
        matchedToken = token;
        break;
      }
    }
    if (!matchedToken || matchedToken.revoked === true) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return {
      sub: userWithToken.id,
      refreshId: matchedToken.id,
    };
  }
}
