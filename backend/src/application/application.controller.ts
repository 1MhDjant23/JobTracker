import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApiResponse } from '../../../packages/contracts/src/common';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AccessStrategyResult } from 'src/auth/auth.types';
import { SaveApplicationDto, UpdateApplicationDto } from './dto/save.dto';
import { JwtAccessStrategy } from 'src/auth/strategies/jwt-access-strategy';
import {
  ApplicationCard,
  ApplicationDetaill,
} from '../../../packages/contracts/src/index';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @UseGuards(JwtAccessGuard)
  async save(
    @Body() dto: SaveApplicationDto,
    @CurrentUser() user: AccessStrategyResult,
  ): Promise<ApiResponse<null>> {
    await this.applicationService.save(dto, user.sub);
    return {
      data: null,
      message: 'Application saved successfully',
    };
  }

  @Get()
  @UseGuards(JwtAccessGuard)
  async getApplications(
    @CurrentUser() user: AccessStrategyResult,
  ): Promise<ApiResponse<ApplicationCard[]>> {
    const applications = await this.applicationService.getApplications(
      user.sub,
    );

    return {
      data: applications,
      message: 'Applications retrieved successfully',
    };
  }

  @Get(':id')
  @UseGuards(JwtAccessGuard)
  async getOneApplication(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AccessStrategyResult,
  ): Promise<ApiResponse<ApplicationDetaill>> {
    const application = await this.applicationService.getOneApplication(
      user.sub,
      id,
    );
    return {
      data: application, // Replace with actual application data
      message: 'Single application retrieved successfully',
    };
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard)
  async update(
    @CurrentUser() user: AccessStrategyResult,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateApplicationDto,
  ): Promise<ApiResponse<null>> {
    if (!dto || Object.keys(dto).length === 0) {
      throw new NotFoundException('No data provided for update.');
    }
    await this.applicationService.updateApplication(dto, id, user.sub);

    return {
      data: null,
      message: 'Application updated successfully',
    };
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard)
  async delete(
    @CurrentUser() user: AccessStrategyResult,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<null>> {
    await this.applicationService.deleteApplication(id, user.sub);

    return {
      data: null,
      message: 'Application deleted successfully',
    };
  }
}
