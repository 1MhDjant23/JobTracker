import { User as PublicUser } from '@jobTracker/contracts';
import { Request } from 'express';
import { RefreshToken } from 'generated/prisma/client';

export interface LoginServiceResult {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}

export type LoginControllerResult = Pick<
  LoginServiceResult,
  'accessToken' | 'user'
>;

export interface RefreshStrategyResult {
  sub: string;
  refreshId: number;
}

export interface AccessStrategyResult {
  sub: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
export interface UserWithToken extends PublicUser {
  refreshTokens: RefreshToken[];
}

export type RefreshServiceResult = Pick<
  LoginServiceResult,
  'accessToken' | 'refreshToken'
>;

export type AuthenticatedUser =
  | (RefreshStrategyResult & Record<string, unknown>)
  | (AccessStrategyResult & Record<string, unknown>);

export type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};
