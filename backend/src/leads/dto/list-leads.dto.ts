import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { LeadStatusDto } from './lead-status.enum';

export class ListLeadsDto {
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number) // Використовуємо Type замість ручного Transform
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 10;

  @ApiPropertyOptional({ enum: LeadStatusDto, enumName: 'LeadStatus' })
  @IsEnum(LeadStatusDto)
  @IsOptional()
  status?: LeadStatusDto;

  @ApiPropertyOptional({ description: 'Search by name/email/company' })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiPropertyOptional({
    enum: ['createdAt', 'updatedAt'],
    default: 'createdAt',
  })
  @IsIn(['createdAt', 'updatedAt'])
  @IsOptional()
  sort: 'createdAt' | 'updatedAt' = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsIn(['asc', 'desc'])
  @IsOptional()
  order: 'asc' | 'desc' = 'desc';
}
