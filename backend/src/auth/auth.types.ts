import { User as PublicUser } from '@jobTracker/contracts';

export interface LoginServiceResult {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}

export type LoginControllerResult = Pick<
  LoginServiceResult,
  'accessToken' | 'user'
>;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
