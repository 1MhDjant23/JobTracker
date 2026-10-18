import { User as PublicUser } from '@jobTracker/contracts';
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
  userId: string;
  refreshId: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
export interface UserWithToken extends PublicUser {
  refreshTokens: RefreshToken[];
}
