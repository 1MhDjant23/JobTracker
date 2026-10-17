import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'accessToken',
      ignoreExpiration: false,
    });
  }
  validate(payload: { sub: string }) {
    return {
      userId: payload.sub,
    };
  }
}
