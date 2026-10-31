import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApplicationStatus, JobType } from '../../../generated/prisma/enums';
import { PartialType } from '@nestjs/mapped-types';

export class SaveApplicationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Company name must be at least 3 characters.' })
  @MaxLength(40, { message: 'Company name too long.' })
  company!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Title must be at least 2 characters.' })
  @MaxLength(60, { message: 'Title too long.' })
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Summary must be at least 10 characters.' })
  @MaxLength(1000, { message: 'Summary too long.' })
  summary!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Role must be at least 2 characters.' })
  @MaxLength(60, { message: 'Role too long.' })
  role!: string;

  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Location must be at least 2 characters.' })
  @MaxLength(60, { message: 'Location too long.' })
  location!: string;

  @IsString()
  @IsOptional()
  @MinLength(10, { message: 'Company email must be at least 10 characters.' })
  @MaxLength(30, { message: 'Company email too long.' })
  companyEmail!: string;

  @IsString()
  @IsOptional()
  @MinLength(10, { message: 'Phone number must be at least 10 characters.' })
  @MaxLength(15, { message: 'Phone number too long.' })
  phone!: string;

  @IsString()
  @IsOptional()
  @MinLength(10, { message: 'Website must be at least 10 characters.' })
  @MaxLength(60, { message: 'Website too long.' })
  website!: string;

  @IsEnum(JobType, { message: 'Invalid job type.' })
  jobType!: JobType;

  @IsString()
  @IsOptional()
  @MinLength(10, { message: 'Posted date must be at least 10 characters.' })
  @MaxLength(30, { message: 'Posted date too long.' })
  postedAt!: string;

  @IsString()
  @IsOptional()
  @MinLength(10, { message: 'Deadline must be at least 10 characters.' })
  @MaxLength(30, { message: 'Deadline too long.' })
  deadline!: string;

  @IsString({ each: true })
  @IsOptional()
  requirements!: string[];

  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Source board must be at least 2 characters.' })
  @MaxLength(30, { message: 'Source board too long.' })
  sourceBoard!: string;

  @IsNumber()
  @IsOptional()
  @MinLength(0, { message: 'Salary min must be at least 0.' })
  @MaxLength(1000000, { message: 'Salary min too high.' })
  salaryMin!: number;

  @IsNumber()
  @IsOptional()
  @MinLength(0, { message: 'Salary min must be at least 0.' })
  @MaxLength(1000000, { message: 'Salary max too high.' })
  salaryMax!: number;
  // field managed by user, not extracted from screenshot
  @IsEnum(ApplicationStatus, { message: 'Invalid application status.' })
  status!: ApplicationStatus;

  @IsDateString()
  @IsOptional()
  appliedAt!: string;

  @IsString()
  @IsOptional()
  notes!: string;
}

export class UpdateApplicationDto extends PartialType(SaveApplicationDto) {}
