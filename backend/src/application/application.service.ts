import { Injectable, NotFoundException } from '@nestjs/common';
import { SaveApplicationDto, UpdateApplicationDto } from './dto/save.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import type {
  ApplicationCard,
  ApplicationDetaill,
} from '../../../packages/contracts/src/index';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}
  async save(dto: SaveApplicationDto, userId: string): Promise<void> {
    await this.prisma.application.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async getApplications(userId: string): Promise<ApplicationCard[]> {
    return await this.prisma.application.findMany({
      where: { userId },
      select: {
        id: true,
        company: true,
        title: true,
        status: true,
        notes: true,
        createdAt: true,
      },
    });
  }

  async getOneApplication(
    userId: string,
    applicationId: string,
  ): Promise<ApplicationDetaill> {
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, userId },
      omit: {
        userId: true,
        updatedAt: true,
        rawExtracted: true,
      },
    });
    if (!application) {
      throw new NotFoundException('Application not found.');
    }
    return application;
  }

  async updateApplication(
    dto: UpdateApplicationDto,
    applicationId: string,
    userId: string,
  ) {
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, userId },
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    const updated = await this.prisma.application.update({
      where: { id: applicationId, userId },
      data: dto,
    });
    return updated;
  }

  async deleteApplication(
    applicationId: string,
    userId: string,
  ): Promise<void> {
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, userId },
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    await this.prisma.application.delete({
      where: { id: applicationId, userId },
    });
  }
}
