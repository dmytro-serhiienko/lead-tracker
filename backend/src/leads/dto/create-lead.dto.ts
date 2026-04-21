import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { LeadStatusDto } from './lead-status.enum';

export class CreateLeadDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'john@company.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Acme Inc.' })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiPropertyOptional({
    enum: LeadStatusDto,
    enumName: 'LeadStatus',
    example: LeadStatusDto.NEW,
  })
  @IsEnum(LeadStatusDto)
  @IsOptional()
  status?: LeadStatusDto;

  @ApiPropertyOptional({ example: 12500 })
  @IsNumber()
  @IsOptional()
  value?: number;

  @ApiPropertyOptional({ example: 'Wants enterprise plan' })
  @IsString()
  @IsOptional()
  notes?: string;
}
