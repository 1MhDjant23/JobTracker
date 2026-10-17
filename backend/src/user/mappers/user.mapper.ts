import { User as PrismaUser } from 'generated/prisma/client';
import { User as PublicUser } from '@jobTracker/contracts';

type PublicUserSource = Pick<PrismaUser, 'id' | 'username' | 'email'>;
export function toPublicUser(user: PublicUserSource): PublicUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
  };
}
