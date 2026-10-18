import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  constructor(private readonly confgService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: confgService.getOrThrow<string>('ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }
  validate(payload: { sub: string }) {
    return {
      userId: payload.sub,
    };
  }
}
