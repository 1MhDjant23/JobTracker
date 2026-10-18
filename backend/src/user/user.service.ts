import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserData } from './user.types';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  /** Create User */
  async create(data: CreateUserData): Promise<void> {
    await this.prisma.user.create({
      data: data,
    });
  }
}
