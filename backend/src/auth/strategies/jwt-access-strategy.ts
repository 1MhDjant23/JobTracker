import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccessStrategyResult } from '../auth.types';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(private readonly confgService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: confgService.getOrThrow<string>('ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }
  validate(payload: { sub: string; type: string }): AccessStrategyResult {
    return {
      sub: payload.sub,
    };
  }
}
