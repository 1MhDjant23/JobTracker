import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TestsService {
  constructor(private readonly prisma: PrismaService) {}

  async test() {
    const count = await this.prisma.test.count();
    console.log(`Count = ${count}`);
  }
}
