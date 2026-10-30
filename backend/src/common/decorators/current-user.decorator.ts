import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  AccessStrategyResult,
  AuthenticatedRequest,
  RefreshStrategyResult,
} from 'src/auth/auth.types';

type CurrentUserProperty = string;

export const CurrentUser = createParamDecorator(
  (data: CurrentUserProperty | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    if (!data || !user) {
      return user;
    }
    return user[data];
  },
);
