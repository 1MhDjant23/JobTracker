import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  onModuleInit() {
    this.$connect()
      .then(() => console.log('DB Connected successfully.'))
      .catch((err) => console.log(err));
  }
  onModuleDestroy() {
    this.$disconnect()
      .then(() => console.log('DB Disconnected'))
      .catch((err) => console.log(err));
  }
}
